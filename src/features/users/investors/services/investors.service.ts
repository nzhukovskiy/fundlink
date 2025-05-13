import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Investor } from "../entities/investor"
import { Repository } from "typeorm"
import { CreateInvestorDto } from "../dtos/create-investor-dto"
import * as bcrypt from "bcrypt"
import { PaginateQuery } from "nestjs-paginate"
import { JwtTokenService } from "../../../token/services/jwt-token.service"
import { UsersService } from "../../services/users.service"
import { UpdateInvestorDto } from "../dtos/update-investor-dto"
import { User } from "../../user/user"
import { Startup } from "../../startups/entities/startup"
import { Investment } from "../../../investments/entities/investment/investment"
import { plainToInstance } from "class-transformer"
import { StartupFullResponseDto } from "../../startups/dtos/responses/startup-full.response.dto/startup-full.response.dto"
import { PaginateService } from "../../../../common/paginate/services/paginate/paginate.service"
import { InvestorStatisticsDto } from "../dtos/investor-statistics.dto/investor-statistics.dto"
import { StartupsRepository } from "../../startups/repositories/startups/startups.repository";
import { InvestmentsRepository } from "../../../investments/repositories/investments/investments.repository";
import { InvestorsRepository } from "../repositories/investors/investors.repository";
import { ErrorCode } from "../../../../constants/error-code";

@Injectable()
export class InvestorsService {
    constructor(
        @InjectRepository(Investor)
        private readonly investorRepository: Repository<Investor>,
        private readonly jwtTokenService: JwtTokenService,
        private readonly paginateService: PaginateService,
        private readonly usersService: UsersService,
        private readonly startupsRepository: StartupsRepository,
        private readonly investmentsRepository: InvestmentsRepository,
        private readonly investorsRepository: InvestorsRepository
    ) {}

    getAll(query: PaginateQuery) {
        return this.paginateService.paginate(query, this.investorRepository)
    }

    async getOne(id: number, relations: string[] = []) {
        const investor = await this.investorRepository.findOne({
            where: { id: id },
            relations: ["investments", ...relations],
        })
        if (!investor) {
            throw new NotFoundException({
                errorCode: ErrorCode.INVESTOR_WITH_ID_DOES_NOT_EXISTS,
                data: {id},
                message: `Investor with an id ${id} does not exist`
              }
            )
        }
        return investor
    }

    async create(createInvestorDto: CreateInvestorDto) {
        const investorDto = createInvestorDto
        if (await this.usersService.findByEmail(investorDto.email)) {
            throw new BadRequestException({
                errorCode: ErrorCode.USER_EMAIL_DUPLICATE,
                data: {email: investorDto.email},
                message: `User with email ${investorDto.email} already exists`
              }
            )
        }
        investorDto.password = await bcrypt.hash(investorDto.password, 10)
        const savedInvestor = await this.investorRepository.save(investorDto)
        const investor = await this.investorRepository.findOneBy({
            id: savedInvestor.id,
        })
        return this.jwtTokenService.generateTokens(investor)
    }

    async update(updateInvestorDto: UpdateInvestorDto, investorData: User) {
        const investor = await this.investorRepository.findOne({
            where: { id: investorData.id },
        })
        if (!investor) {
            throw new NotFoundException(
                `Investor with an id ${investorData.id} does not exist`
            )
        }
        Object.assign(investor, updateInvestorDto)
        return this.investorRepository.save(investor)
    }

    async getStartupsForInvestor(id: number) {
        const startups = await this.startupsRepository.getStartupsForInvestor(id)
        return plainToInstance(StartupFullResponseDto, startups)
    }

    getFullInvestmentsInfo(id: number) {
        return this.investmentsRepository.getInvestmentsForInvestor(id)
    }

    getCurrent(payload: User) {
        return this.getOne(payload.id, ["interestingStartups"])
    }

    getInvestorsNumber() {
        return this.investorRepository.createQueryBuilder("investor").getCount()
    }

    async getStats(investorId: number) {
        const averageInvestmentAmount = (
            await this.investorsRepository.getAverageInvestmentAmount(investorId)
        ).avg

        if (averageInvestmentAmount == null) {
            return {}
        }

        const startupsCount = await this.startupsRepository.getStartupsCountForInvestor(investorId)
        const lastInvestmentDate = (
            await this.investmentsRepository
                .getLastInvestmentDateForInvestor(investorId)
        ).date
        return {
            averageInvestmentAmount,
            startupsCount,
            lastInvestmentDate,
        } as InvestorStatisticsDto
    }
}
