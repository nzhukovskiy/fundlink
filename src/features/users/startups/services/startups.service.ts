import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Startup } from "../entities/startup"
import { Repository } from "typeorm"
import { CreateStartupDto } from "../dtos/requests/create-startup-dto"
import * as bcrypt from "bcrypt"
import { PaginateService } from "../../common/services/paginate/paginate.service"
import { PaginateQuery } from "nestjs-paginate"
import { UpdateStartupDto } from "../dtos/requests/update-startup-dto"
import { FundingRoundsService } from "../../../investments/services/funding-rounds.service"
import { JwtTokenService } from "../../../token/services/jwt-token.service"
import { Investor } from "../../investors/entities/investor"
import { UsersService } from "../../services/users.service"
import { User } from "../../user/user"
import { Tag } from "../../../tags/entities/tag/tag"
import Decimal from "decimal.js"

@Injectable()
export class StartupsService {
    constructor(
        @InjectRepository(Startup)
        private readonly startupRepository: Repository<Startup>,
        @InjectRepository(Investor)
        private readonly investorRepository: Repository<Investor>,
        @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
        private readonly usersService: UsersService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly paginateService: PaginateService,
        private readonly fundingRoundsService: FundingRoundsService
    ) {}

    incomeTaxRate = "0.18"
    interestRate = "0.18"
    bonds10YearsYield = "0.16"
    beta = "1.3"
    stockMarketAverageReturn = "0.083"

    async getAll(query: PaginateQuery, title = "", tag = "", isInteresting = false, investorId = -1, params = {}) {
        const startupsQuery =
            this.startupRepository.createQueryBuilder("startup")

        if (tag) {
            startupsQuery
                .leftJoin("startup.tags", "tag")
                .where("tag.title = :tagTitle", { tagTitle: tag })
        }
        if (title) {
            startupsQuery.andWhere("startup.title ILIKE :title", {
                title: `%${title}%`,
            })
        }
        if (isInteresting) {
            startupsQuery
                .andWhere(
                    `
            EXISTS (
                SELECT 1 
                FROM investor_interesting_startups_startup iiss  
                WHERE iiss."startupId"  = startup.id and iiss."investorId" = :investorId
            )`
                )
                .setParameter("investorId", investorId)
        }

        return this.paginateService.paginate(query, startupsQuery, {
            ...params,
            relations: ["fundingRounds"],
        })
    }

    async getOne(id: number, includeInvestments = false, investorId?: number) {
        let startupQuery = this.startupRepository
            .createQueryBuilder("startup")
            .leftJoinAndSelect("startup.fundingRounds", "fundingRound")
        if (includeInvestments) {
            startupQuery = startupQuery
                .leftJoinAndSelect("fundingRound.investments", "investment")
                .leftJoinAndSelect("investment.investor", "investor")
        }
        if (investorId) {
            startupQuery = startupQuery
                .addSelect(
                    `
            EXISTS (
                SELECT 1 
                FROM investor_interesting_startups_startup iiss  
                WHERE iiss."startupId"  = startup.id and iiss."investorId" = :investorId
            )`,
                    "isInteresting"
                )
                .setParameter("investorId", investorId)
        }
        const startup = await startupQuery
            .where("startup.id = :id", { id })
            .orderBy("fundingRound.startDate", "ASC")
            .leftJoinAndSelect("startup.tags", "tag")
            .where("startup.id = :id", { id })
            .getRawAndEntities()

        if (!startup) {
            throw new NotFoundException(
                `Startup with an id ${id} does not exist`
            )
        }
        return {
            ...startup.entities[0],
            isInteresting: startup.raw[0].isInteresting,
            dcf: this.calculateDcf(startup.entities[0]),
        }
    }

    async getCurrent(userData: User) {
        return this.getOne(userData.id, true)
    }

    async create(createStartupDto: CreateStartupDto) {
        const startupDto = createStartupDto
        if (await this.usersService.findByEmail(startupDto.email)) {
            throw new BadRequestException(
                `User with email ${startupDto.email} already exists`
            )
        }
        startupDto.password = await bcrypt.hash(startupDto.password, 10)
        const savedStartup = await this.startupRepository.save(startupDto)
        await this.fundingRoundsService.create(savedStartup.id, {
            fundingGoal: createStartupDto.initialFundingGoal,
            startDate: new Date(),
            endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            ),
        })
        const startup = await this.startupRepository.findOneBy({
            id: savedStartup.id,
        })
        delete startup.password
        startup["role"] = startup.getRole()
        return {
            accessToken: await this.jwtTokenService.generateToken(startup),
        }
    }

    async update(id: number, updateStartupDto: UpdateStartupDto) {
        const startup = await this.startupRepository.findOne({
            where: { id: id },
        })
        if (!startup) {
            throw new NotFoundException(
                `Startup with an id ${id} does not exist`
            )
        }
        Object.assign(startup, updateStartupDto)
        if (!updateStartupDto.logoPath) {
            startup.logoPath = null
        }
        return this.startupRepository.save(startup)
    }

    async getInvestors(id: number, fundingRoundId?: number) {
        let whereClause: string
        if (fundingRoundId) {
            whereClause =
                "startup.id = :id and fundingRound.id = :fundingRoundId"
        } else {
            whereClause = "startup.id = :id"
        }
        return this.investorRepository
            .createQueryBuilder("investor")
            .innerJoin("investor.investments", "investment")
            .innerJoin("investment.fundingRound", "fundingRound")
            .innerJoin("fundingRound.startup", "startup")
            .where(whereClause, { id, fundingRoundId })
            .andWhere("investment.stage = 'completed'")
            .select([
                "investor.id as id",
                "investor.name as name",
                "investor.surname as surname",
                "investor.email as email",
                'SUM(investment.amount) AS "totalInvestment"',
            ])
            .groupBy("investor.id")
            .addGroupBy("investor.name")
            .distinct(true)
            .getRawMany()
    }

    async uploadPresentation(startupId: number, fileName: string) {
        const startup = await this.startupRepository.findOneBy({
            id: startupId,
        })
        if (!startup) {
            throw new NotFoundException("Startup with this id not found")
        }
        startup.presentationPath = fileName
        return this.startupRepository.save(startup)
    }

    async assignTag(tagId: number, startupId: number) {
        const startup = await this.getOne(startupId)
        const tag = await this.tagRepository.findOneBy({ id: tagId })
        if (!tag) {
            throw new NotFoundException(`Tag with id ${tagId} not found`)
        }
        if (!startup.tags.some((x) => x.id === tagId)) {
            startup.tags.push(tag)
        }
        return this.startupRepository.save(startup)
    }

    async removeTag(tagId: number, startupId: number) {
        const startup = await this.getOne(startupId)
        startup.tags = startup.tags.filter((tag) => tag.id !== tagId)
        return this.startupRepository.save(startup)
    }

    calculateDcf(startup: Startup) {
        let dcf = new Decimal(0)
        if (
            !startup.revenuePerYear ||
            !startup.capitalExpenditures ||
            !startup.changesInWorkingCapital ||
            !startup.deprecationAndAmortization
        ) {
            return
        }
        let totalInvestments = new Decimal("0")
        startup.fundingRounds.forEach((round) => {
            totalInvestments = totalInvestments.plus(
                new Decimal(round.currentRaised)
            )
        })
        if (totalInvestments.equals(0)) {
            return dcf
        }
        startup.revenuePerYear.forEach((revenue, i) => {
            const fcf = new Decimal(revenue)
                .mul(new Decimal("1").minus(new Decimal(this.incomeTaxRate)))
                .plus(new Decimal(startup.deprecationAndAmortization[i]))
                .minus(new Decimal(startup.capitalExpenditures[i]))
                .minus(new Decimal(startup.changesInWorkingCapital[i]))
            dcf = dcf.plus(
                fcf.div(
                    new Decimal(1)
                        .plus(
                            this.calculateDiscountRate(
                                startup,
                                totalInvestments
                            )
                        )
                        .pow(new Decimal(i).plus(1))
                )
            )
        })
        return dcf
    }

    async uploadLogo(startupId: number, fileName: string) {
        const startup = await this.startupRepository.findOneBy({
            id: startupId,
        })
        if (!startup) {
            throw new NotFoundException("Startup with this id not found")
        }
        startup.logoPath = fileName
        return this.startupRepository.save(startup)
    }

    async markAsInteresting(startupId: number, investorId: number) {
        const startup = await this.startupRepository.findOneBy({
            id: startupId,
        })
        const investor = await this.investorRepository.findOne({
            where: { id: investorId },
            relations: ["interestingStartups"],
        })
        investor.interestingStartups.push(startup)
        return this.investorRepository.save(investor)
    }

    async removeFromInteresting(startupId: number, investorId: number) {
        const investor = await this.investorRepository.findOne({
            where: { id: investorId },
            relations: ["interestingStartups"],
        })
        investor.interestingStartups = investor.interestingStartups.filter(
            (x) => x.id !== startupId
        )
        return this.investorRepository.save(investor)
    }

    private calculateDiscountRate(startup: Startup, totalInvestments: Decimal) {
        const v = totalInvestments.plus(new Decimal(startup.debtAmount))
        const costOfEquity = new Decimal(this.bonds10YearsYield).plus(
            new Decimal(this.beta).mul(
                new Decimal(this.stockMarketAverageReturn).minus(
                    new Decimal(this.bonds10YearsYield)
                )
            )
        )
        return totalInvestments
            .div(v)
            .mul(costOfEquity)
            .plus(
                new Decimal(startup.debtAmount)
                    .div(v)
                    .mul(new Decimal(this.interestRate))
                    .mul(new Decimal(1).minus(new Decimal(this.incomeTaxRate)))
            )
    }
}
