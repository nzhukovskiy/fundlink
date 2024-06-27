import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../entities/startup";
import { Repository } from "typeorm";
import { CreateStartupDto } from "../dtos/create-startup-dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { PaginateService } from "../../common/services/paginate/paginate.service";
import { PaginateQuery } from "nestjs-paginate";
import { UpdateStartupDto } from "../dtos/update-startup-dto";
import { FundingRoundsService } from "../../../investments/services/funding-rounds.service";
import { FundingStage } from "../../../investments/constants/funding-stage";
import { JwtTokenService } from "../../../token/services/jwt-token.service";
import { Investor } from "../../investors/entities/investor";
import { UsersService } from "../../services/users.service";

@Injectable()
export class StartupsService {
    constructor(@InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                private readonly usersService: UsersService,
                private readonly jwtTokenService: JwtTokenService,
                private readonly paginateService: PaginateService,
                private readonly fundingRoundsService: FundingRoundsService) {
    }

    getAll(query: PaginateQuery) {
        return this.paginateService.paginate(query, this.startupRepository);
    }

    async getOne(id: number) {
        let startup = await this.startupRepository.findOne({ where: { id: id }, relations: { fundingRounds: true } });
        if (!startup) {
            throw new NotFoundException(`Startup with an id ${id} does not exist`);
        }
        return startup;
    }

    async create(createStartupDto: CreateStartupDto) {
        let startupDto = createStartupDto;
        if (await this.usersService.findByEmail(startupDto.email)) {
            throw new BadRequestException(`User with email ${startupDto.email} already exists`);
        }
        startupDto.password = await bcrypt.hash(startupDto.password, 10);
        let savedStartup = await this.startupRepository.save(startupDto);
        await this.fundingRoundsService.create(savedStartup.id, {
            fundingGoal: "10000",
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        })
        let startup = await this.startupRepository.findOneBy({id: savedStartup.id});
        delete startup.password;
        startup["role"] = startup.getRole();
        return {
            accessToken: await this.jwtTokenService.generateToken(startup)
        }
    }

    async update(id: number, updateStartupDto: UpdateStartupDto) {
        let startup = await this.startupRepository.findOne({ where: {id: id} });
        if (!startup) {
            throw new NotFoundException(`Startup with an id ${id} does not exist`)
        }
        Object.assign(startup, updateStartupDto);
        return this.startupRepository.save(startup);
    }
}
