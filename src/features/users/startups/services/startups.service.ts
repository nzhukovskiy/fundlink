import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm"
import { Startup } from "../entities/startup"
import { DataSource, Repository } from "typeorm"
import { CreateStartupDto } from "../dtos/requests/create-startup-dto"
import * as bcrypt from "bcrypt"
import { PaginateQuery } from "nestjs-paginate"
import { UpdateStartupDto } from "../dtos/requests/update-startup-dto"
import { FundingRoundsService } from "../../../investments/services/funding-rounds.service"
import { JwtTokenService } from "../../../token/services/jwt-token.service"
import { Investor } from "../../investors/entities/investor"
import { UsersService } from "../../services/users.service"
import { User } from "../../user/user"
import { Tag } from "../../../tags/entities/tag/tag"
import Decimal from "decimal.js"
import { PaginateService } from "../../../../common/paginate/services/paginate/paginate.service"
import { DcfDetailedDto } from "../dtos/responses/dcf-detailed.dto/dcf-detailed.dto"
import { WaccDetailsDto } from "../dtos/responses/wacc-details.dto/wacc-details.dto"
import { FundingRound } from "../../../investments/entities/funding-round/funding-round"
import { ExitStartupDto } from "../dtos/requests/exit-startup.dto"
import { Exit } from "../entities/exit"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Roles } from "../../constants/roles"
import { NotificationTypes } from "../../../notifications/constants/notification-types"
import { ExitType } from "../../constants/exit-type"
import { StartupStage } from "../../constants/startup-stage"
import { ErrorCode } from "../../../../constants/error-code"
import { DcfValuationService } from "./valuation/dcf-valuation.service"
import { ValuationService } from "./valuation/valuation.service"

@Injectable()
export class StartupsService {
    constructor(
        @InjectRepository(Startup)
        private readonly startupRepository: Repository<Startup>,
        @InjectRepository(Investor)
        private readonly investorRepository: Repository<Investor>,
        @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
        @InjectRepository(FundingRound)
        private readonly fundingRoundRepository: Repository<FundingRound>,
        @InjectRepository(Exit)
        private readonly exitRepository: Repository<Exit>,
        private readonly usersService: UsersService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly paginateService: PaginateService,
        private readonly fundingRoundsService: FundingRoundsService,
        @InjectDataSource()
        private dataSource: DataSource,
        private readonly eventEmitter2: EventEmitter2,
        private readonly valuationService: ValuationService
    ) {}

    async getAll(
        query: PaginateQuery,
        title = "",
        tag = "",
        isInteresting = false,
        onlyActive = false,
        includeExited = false,
        investorId = -1,
        params = {}
    ) {
        const startupsQuery = this.startupRepository
            .createQueryBuilder("startup")
            .leftJoinAndSelect("startup.fundingRounds", "fundingRound")

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
            console.log(investorId)
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
        if (onlyActive) {
            startupsQuery.andWhere(
                `
            EXISTS (
                SELECT 1 
                FROM funding_round fr
                WHERE fr."startupId" = startup.id and fr."isCurrent" = true
            )`
            )
        }

        if (!includeExited) {
            startupsQuery.andWhere("startup.stage = 'ACTIVE'")
        }

        return this.paginateService.paginate(query, startupsQuery, {
            ...params,
            // relations: ["fundingRounds"],
        })
    }

    async getOne(id: number, includeInvestments = false, investorId?: number) {
        let startupQuery = this.startupRepository
            .createQueryBuilder("startup")
            .leftJoinAndSelect("startup.fundingRounds", "fundingRound")
        if (includeInvestments) {
            startupQuery = startupQuery
                .leftJoinAndSelect("fundingRound.investments", "investment")
                .addSelect(
                    `
            EXISTS (
                SELECT 1 
                FROM funding_round_change_proposal frcp  
                WHERE frcp."fundingRoundId"  = "fundingRound".id and frcp.status = 'PENDING_REVIEW'
            )`,
                    "isUpdating"
                )
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
            .leftJoinAndSelect("startup.exit", "exit")
            .where("startup.id = :id", { id })
            .getRawAndEntities()

        if (!startup.raw.length) {
            throw new NotFoundException({
                errorCode: ErrorCode.STARTUP_WITH_ID_DOES_NOT_EXISTS,
                data: { id },
                message: `Startup with an id ${id} does not exist`,
            })
        }
        const startupEntity = startup.entities[0]

        const rawMap = startup.raw.map((raw) => ({
            startupId: raw["startup_id"],
            fundingRoundId: raw["fundingRound_id"],
            isUpdating: raw["isUpdating"],
        }))

        for (const fundingRound of startupEntity.fundingRounds) {
            const match = rawMap.find(
                (r) =>
                    r.startupId === startupEntity.id &&
                    r.fundingRoundId === fundingRound.id
            )
            if (match) {
                ;(fundingRound as any).isUpdating = match.isUpdating
            }
        }

        return {
            ...startupEntity,
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
        if (startup.stage !== StartupStage.ACTIVE) {
            throw new BadRequestException("Cannot update the exited startup")
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
            .andWhere("investment.stage = 'COMPLETED'")
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
        if (startup.stage !== StartupStage.ACTIVE) {
            throw new BadRequestException("Cannot update the exited startup")
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
        if (startup.stage !== StartupStage.ACTIVE) {
            throw new BadRequestException("Cannot update the exited startup")
        }
        if (!startup.tags.some((x) => x.id === tagId)) {
            startup.tags.push(tag)
        }
        return this.startupRepository.save(startup)
    }

    async removeTag(tagId: number, startupId: number) {
        const startup = await this.getOne(startupId)
        if (startup.stage !== StartupStage.ACTIVE) {
            throw new BadRequestException("Cannot update the exited startup")
        }
        startup.tags = startup.tags.filter((tag) => tag.id !== tagId)
        return this.startupRepository.save(startup)
    }

    calculateDcf(startup: Startup) {
        return this.valuationService.valuate(startup)
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

    async getMostPopularStartups() {
        const recentInvestmentsSubQuery = this.fundingRoundRepository
            .createQueryBuilder("fundingRound")
            .select(`SUM(i.amount) as investments_amount`)
            .leftJoin("fundingRound.investments", "i")
            .where(
                '"fundingRound"."startupId" = startup.id and "i".stage=\'COMPLETED\' and "i"."date" >  CURRENT_DATE - interval \'30 days\''
            )
            .getQuery()

        const totalInvestmentsSubQuery = this.fundingRoundRepository
            .createQueryBuilder("fundingRound")
            .select(`SUM(i.amount) as total_investments`)
            .leftJoin("fundingRound.investments", "i")
            .where(
                '"fundingRound"."startupId" = startup.id and "i".stage=\'COMPLETED\''
            )
            .getQuery()

        const uniqueInvestorsSubQuery = this.fundingRoundRepository
            .createQueryBuilder("fundingRound")
            .select(`COUNT(DISTINCT(investor.id)) as investors_count`)
            .leftJoin("fundingRound.investments", "investment")
            .leftJoin("investment.investor", "investor")
            .where(
                '"fundingRound"."startupId" = startup.id and "investment".stage=\'COMPLETED\''
            )
            .getQuery()

        const interestingCountSubQuery = this.dataSource
            .createQueryBuilder()
            .select(`COUNT(DISTINCT(iiss."investorId")) as investors_count`)
            .from("investor_interesting_startups_startup", "iiss")
            .where('iiss."startupId" = startup.id')
            .getQuery()

        const startups = await this.startupRepository
            .createQueryBuilder("startup")
            .leftJoinAndSelect("startup.fundingRounds", "fundingRound")
            .addSelect(
                `(${recentInvestmentsSubQuery})`,
                "recentInvestmentsTotal"
            )
            .addSelect(`(${totalInvestmentsSubQuery})`, "investmentsTotal")
            .addSelect(`(${uniqueInvestorsSubQuery})`, "uniqueInvestors")
            .addSelect(`(${interestingCountSubQuery})`, "interestingCount")
            .take(5)
            .getRawAndEntities()

        const rawMap = new Map<number, any>()
        startups.raw.forEach((row) => {
            rawMap.set(row.startup_id, row)
        })
        const mappedStartups = startups.entities.map((x, i) => {
            const raw = rawMap.get(x.id)
            return {
                ...x,
                investmentsTotal: parseFloat(raw?.investmentsTotal || 0),
                recentInvestmentsTotal: parseFloat(
                    raw?.recentInvestmentsTotal || 0
                ),
                uniqueInvestors: parseInt(raw?.uniqueInvestors || 0, 10),
                interestingCount: parseInt(raw?.interestingCount || 0, 10),
            }
        })
        const startupResults = Map<number, number>
        const minTotalInvestment = Math.min(
            ...mappedStartups.map((x) => x.investmentsTotal as number)
        )
        const maxTotalInvestment = Math.max(
            ...mappedStartups.map((x) => x.investmentsTotal as number)
        )
        const minRecentInvestment = Math.min(
            ...mappedStartups.map((x) => x.recentInvestmentsTotal as number)
        )
        const maxRecentInvestment = Math.max(
            ...mappedStartups.map((x) => x.recentInvestmentsTotal as number)
        )
        const minUniqueInvestors = Math.min(
            ...mappedStartups.map((x) => x.uniqueInvestors as number)
        )
        const maxUniqueInvestors = Math.max(
            ...mappedStartups.map((x) => x.uniqueInvestors as number)
        )
        const minInterestingCount = Math.min(
            ...mappedStartups.map((x) => x.interestingCount as number)
        )
        const maxInterestingCount = Math.max(
            ...mappedStartups.map((x) => x.interestingCount as number)
        )

        for (const startup of mappedStartups) {
            const recentScore =
                ((startup.recentInvestmentsTotal - minRecentInvestment) /
                    (maxRecentInvestment - minRecentInvestment)) *
                100
            const totalScore =
                ((startup.investmentsTotal - minTotalInvestment) /
                    (maxTotalInvestment - minTotalInvestment)) *
                100
            const investorsScore =
                ((startup.uniqueInvestors - minUniqueInvestors) /
                    (maxUniqueInvestors - minUniqueInvestors)) *
                100
            const interestingScore =
                ((startup.interestingCount - minInterestingCount) /
                    (maxInterestingCount - minInterestingCount)) *
                100
            startupResults[startup.id] =
                recentScore * 0.4 +
                totalScore * 0.2 +
                investorsScore * 0.25 +
                interestingScore * 0.15
        }
        return mappedStartups.sort(
            (a, b) => -(startupResults[a.id] - startupResults[b.id])
        )
    }

    async getMostFundedStartups() {
        const totalInvestmentsSubQuery = this.fundingRoundRepository
            .createQueryBuilder("fundingRound")
            .select(`COALESCE(SUM(i.amount), 0) as total_investments`)
            .leftJoin("fundingRound.investments", "i")
            .where(
                '"fundingRound"."startupId" = startup.id and "i".stage=\'COMPLETED\''
            )
            .getQuery()

        const startupsRawAndEntities = await this.startupRepository
            .createQueryBuilder("startup")
            .leftJoinAndSelect("startup.fundingRounds", "fundingRound")
            .addSelect(`(${totalInvestmentsSubQuery})`, "investmentsTotal")
            .take(5)
            .getRawAndEntities()

        const aggregatedMap: Record<string, number> = {}
        startupsRawAndEntities.raw.forEach((raw) => {
            aggregatedMap[raw.startup_id] = Number(raw.investmentsTotal)
        })

        return startupsRawAndEntities.entities
            .map((startup) => ({
                ...startup,
                investmentsTotal: aggregatedMap[startup.id] || 0,
            }))
            .sort((a, b) => b.investmentsTotal - a.investmentsTotal)
    }

    getStartupsNumber() {
        return this.startupRepository.createQueryBuilder("startup").getCount()
    }

    getRecentlyJoinedNumber() {
        return this.startupRepository
            .createQueryBuilder("startup")
            .where(`startup."joinedAt" >  CURRENT_DATE - interval '30 days'`)
            .getCount()
    }

    async exitStartup(startupId: number, exitStartupDto: ExitStartupDto) {
        const startup = await this.getOne(startupId)
        if (startup.exit) {
            throw new BadRequestException("Startup already exited")
        }
        if (exitStartupDto.type === ExitType.BANKRUPT) {
            exitStartupDto.value = "0"
        } else if (!exitStartupDto.value) {
            throw new BadRequestException("Exit value must be provided")
        }
        startup.exit = this.exitRepository.create(exitStartupDto)
        startup.stage = StartupStage.EXITED
        const investors = await this.getInvestors(startup.id)
        const savedStartup = await this.startupRepository.save(startup)

        for (const investor of investors) {
            const share = await this.calculateInvestorShareForStartup(
                investor.id,
                savedStartup.id
            )
            const investorResult = new Decimal(startup.exit.value)
                .mul(new Decimal(share.sharePercentage))
                .div(100)
            this.eventEmitter2.emit("notification", {
                userId: investor.id,
                userType: Roles.INVESTOR,
                type: NotificationTypes.STARTUP_EXIT,
                text: `Стартап ${savedStartup.title} вышел по сценарию ${savedStartup.exit.type}`,
                exit: savedStartup.exit,
                exitInvestorShare: investorResult.toString(),
            })
        }
        return this.getOne(startupId, true)
    }

    private async calculateInvestorShareForStartup(
        investorId: number,
        startupId: number
    ) {
        return await this.startupRepository
            .createQueryBuilder("startup")
            .select(["startup.*"])
            .addSelect('SUM(investment.amount) AS "totalInvestment"')
            .addSelect(
                `(SUM(investment.amount) * 100.0) / (
            SELECT SUM(investment_sub.amount)
            FROM investment investment_sub
            INNER JOIN funding_round funding_round_sub
            ON investment_sub."fundingRoundId" = funding_round_sub.id
            WHERE funding_round_sub."startupId" = startup.id) AS "sharePercentage"`
            )
            .addSelect(
                `(SELECT SUM(investment_sub.amount)
            FROM investment investment_sub
            INNER JOIN funding_round funding_round_sub
            ON investment_sub."fundingRoundId" = funding_round_sub.id
            WHERE funding_round_sub."startupId" = startup.id) AS "totalInvestmentsForStartup"`
            )
            .innerJoin("startup.fundingRounds", "fundingRound")
            .innerJoin("fundingRound.investments", "investment")
            .innerJoin("investment.investor", "investor")
            .where("investor.id = :investorId", { investorId })
            .andWhere("startup.id = :startupId", { startupId })
            .andWhere("investment.stage = 'COMPLETED'")
            .groupBy("startup.id")
            .getRawOne()
    }
}
