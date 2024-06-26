import { Injectable, NotFoundException } from "@nestjs/common";
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

@Injectable()
export class StartupsService {
    constructor(@InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                private readonly jwtService: JwtService,
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
        let startup = createStartupDto;
        startup.password = await bcrypt.hash(startup.password, 10);
        let savedStartup = await this.startupRepository.save(startup);
        await this.fundingRoundsService.create(savedStartup.id, {
            fundingGoal: "10000",
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        })
        return {
            accessToken: await this.jwtService.signAsync({id: savedStartup.id, email: savedStartup.email})
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
