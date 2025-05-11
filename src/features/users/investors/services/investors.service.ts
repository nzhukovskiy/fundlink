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

@Injectable()
export class InvestorsService {
    constructor(
        @InjectRepository(Investor)
        private readonly investorRepository: Repository<Investor>,
        @InjectRepository(Startup)
        private readonly startupRepository: Repository<Startup>,
        @InjectRepository(Investment)
        private readonly investmentRepository: Repository<Investment>,
        private readonly jwtTokenService: JwtTokenService,
        private readonly paginateService: PaginateService,
        private readonly usersService: UsersService
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
            throw new NotFoundException(
                `Investor with an id ${id} does not exist`
            )
        }
        return investor
    }

    async create(createInvestorDto: CreateInvestorDto) {
        const investorDto = createInvestorDto
        if (await this.usersService.findByEmail(investorDto.email)) {
            throw new BadRequestException(
                `User with email ${investorDto.email} already exists`
            )
        }
        investorDto.password = await bcrypt.hash(investorDto.password, 10)
        const savedInvestor = await this.investorRepository.save(investorDto)
        const investor = await this.investorRepository.findOneBy({
            id: savedInvestor.id,
        })
        delete investor.password
        investor["role"] = investor.getRole()
        return {
            accessToken: await this.jwtTokenService.generateToken(investor),
        }
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
        const startups = await this.startupRepository
            .createQueryBuilder("startup")
            .select(["startup.*"])
            .addSelect('SUM(investment.amount) AS "totalInvestment"')
            .addSelect(
                `(SUM(investment.amount) * 100.0) / (
            SELECT SUM(investment_sub.amount)
            FROM investment investment_sub
            INNER JOIN funding_round funding_round_sub
            ON investment_sub."fundingRoundId" = funding_round_sub.id
            WHERE funding_round_sub."startupId" = startup.id and investment_sub.stage = 'COMPLETED') AS "sharePercentage"`
            )
            .addSelect(
                `(SELECT SUM(investment_sub.amount)
            FROM investment investment_sub
            INNER JOIN funding_round funding_round_sub
            ON investment_sub."fundingRoundId" = funding_round_sub.id
            WHERE funding_round_sub."startupId" = startup.id and investment_sub.stage = 'COMPLETED') AS "totalInvestmentsForStartup"`
            )
            .innerJoin("startup.fundingRounds", "fundingRound")
            .innerJoin("fundingRound.investments", "investment")
            .innerJoin("investment.investor", "investor")
            .where("investor.id = :id", { id })
            .andWhere("investment.stage = 'COMPLETED'")
            .groupBy("startup.id")
            .getRawMany()

        return plainToInstance(StartupFullResponseDto, startups)
    }

    getFullInvestmentsInfo(id: number) {
        return this.investmentRepository
            .createQueryBuilder("investment")
            .innerJoin("investment.fundingRound", "fundingRound")
            .innerJoin("fundingRound.startup", "startup")
            .where("investment.investorId = :id", { id })
            .select([
                "investment.id as id",
                "investment.amount as amount",
                "investment.date as date",
                'investment.approvalType as "approvalType"',
                "investment.stage as stage",
                "startup.id",
                "startup.title",
            ])
            .orderBy("investment.date", "ASC")
            .getRawMany()
    }

    getCurrent(payload: User) {
        return this.getOne(payload.id, ["interestingStartups"])
    }

    getInvestorsNumber() {
        return this.investorRepository.createQueryBuilder("investor").getCount()
    }

    async getStats(investorId: number) {
        const averageInvestmentAmount = (
            await this.investorRepository
                .createQueryBuilder("investor")
                .leftJoinAndSelect("investor.investments", "investment")
                .select("AVG(investment.amount) as avg")
                .where("investor.id = :id", { id: investorId })
                .andWhere("investment.stage = 'COMPLETED'")
                .getRawOne()
        ).avg

        if (averageInvestmentAmount == null) {
            return {}
        }

        const startupsCount = await this.startupRepository
            .createQueryBuilder("startup")
            .leftJoin("startup.fundingRounds", "fundingRound")
            .leftJoin("fundingRound.investments", "investment")
            .leftJoinAndSelect("investment.investor", "investor")
            .where("investor.id = :id", { id: investorId })
            .andWhere("investment.stage = 'COMPLETED'")
            .getCount()

        const lastInvestmentDate = (
            await this.investmentRepository
                .createQueryBuilder("investment")
                .leftJoin("investment.investor", "investor")
                .where("investor.id = :id", { id: investorId })
                .andWhere("investment.stage = 'COMPLETED'")
                .take(1)
                .orderBy("investment.date", "DESC")
                .getOne()
        ).date
        return {
            averageInvestmentAmount,
            startupsCount,
            lastInvestmentDate,
        } as InvestorStatisticsDto
    }
}
