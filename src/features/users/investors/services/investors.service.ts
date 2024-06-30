import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Investor } from "../entities/investor";
import { Repository } from "typeorm";
import { CreateInvestorDto } from "../dtos/create-investor-dto";
import * as bcrypt from "bcrypt";
import { PaginateQuery } from "nestjs-paginate";
import { PaginateService } from "../../common/services/paginate/paginate.service";
import { JwtTokenService } from "../../../token/services/jwt-token.service";
import { UsersService } from "../../services/users.service";
import { UpdateInvestorDto } from "../dtos/update-investor-dto";
import { User } from "../../user/user";
import { Startup } from "../../startups/entities/startup";

@Injectable()
export class InvestorsService {
    constructor(@InjectRepository(Investor) private readonly investorRepository: Repository<Investor>,
                @InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                private readonly jwtTokenService: JwtTokenService,
                private readonly paginateService: PaginateService,
                private readonly usersService: UsersService) {
    }

    getAll(query: PaginateQuery) {
        return this.paginateService.paginate(query, this.investorRepository);
    }

    async getOne(id: number) {
        let investor = await this.investorRepository.findOne({ where: { id: id }, relations: {investments: true} });
        if (!investor) {
            throw new NotFoundException(`Investor with an id ${id} does not exist`);
        }
        return investor;
    }

    async create(createInvestorDto: CreateInvestorDto) {
        let investorDto = createInvestorDto;
        if (await this.usersService.findByEmail(investorDto.email)) {
            throw new BadRequestException(`User with email ${investorDto.email} already exists`);
        }
        investorDto.password = await bcrypt.hash(investorDto.password, 10);
        let savedInvestor = await this.investorRepository.save(investorDto);
        let investor = await this.investorRepository.findOneBy({id: savedInvestor.id});
        delete investor.password
        investor["role"] = investor.getRole()
        return {
            accessToken: await this.jwtTokenService.generateToken(investor)
        }
    }

    async update(updateInvestorDto: UpdateInvestorDto, investorData: User) {
        let investor = await this.getOne(investorData.id);
        Object.assign(investor, updateInvestorDto);
        return await this.investorRepository.save(investor);
    }

    async getStartupsForInvestor(id: number) {
        return this.startupRepository.createQueryBuilder('startup')
          .innerJoin('startup.fundingRounds', 'fundingRound')
          .innerJoin('fundingRound.investments', 'investment')
          .innerJoin('investment.investor', 'investor')
          .where('investor.id = :id', { id })
          .distinct(true)
          .getMany();
    }

    getCurrent(payload: User) {
        return this.getStartupsForInvestor(payload.id);
    }
}
