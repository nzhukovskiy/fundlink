import { Injectable, NotFoundException } from "@nestjs/common"
import { PaginateQuery } from "nestjs-paginate"
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm"
import { Startup } from "../../entities/startup"
import { DataSource, Repository } from "typeorm"
import { Investor } from "../../../investors/entities/investor"
import { Tag } from "../../../../tags/entities/tag/tag"
import { FundingRound } from "../../../../investments/entities/funding-round/funding-round"
import { Exit } from "../../entities/exit"
import { UsersService } from "../../../services/users.service"
import { JwtTokenService } from "../../../../token/services/jwt-token.service"
import { PaginateService } from "../../../../../common/paginate/services/paginate/paginate.service"
import { FundingRoundsService } from "../../../../investments/services/funding-rounds.service"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { ValuationService } from "../../services/valuation/valuation.service"
import { ErrorCode } from "../../../../../constants/error-code"

@Injectable()
export class StartupsRepository {

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
    ) {
    }

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
                (fundingRound as any).isUpdating = match.isUpdating
            }
        }

        return {
            ...startupEntity,
            isInteresting: startup.raw[0].isInteresting,
        }
    }
}