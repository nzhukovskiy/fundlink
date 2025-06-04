import { Injectable } from "@nestjs/common"
import { Roles } from "../../../constants/roles"
import { Startup } from "../../entities/startup.entity"
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import { FundingRound } from "../../../../investments/entities/funding-round/funding-round"

@Injectable()
export class StartupsStatsService {
    constructor(
        @InjectRepository(Startup)
        private readonly startupRepository: Repository<Startup>,
        @InjectRepository(FundingRound)
        private readonly fundingRoundRepository: Repository<FundingRound>,
        @InjectDataSource()
        private dataSource: DataSource
    ) {}

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
            .andWhere("startup.stage = 'ACTIVE'")
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
                getRole: () => Roles.STARTUP,
            }
        })
        const startupResults = Map<number, number>
        const metrics = {
            totalInvestments: this.getMinMaxMetric(
                mappedStartups,
                "investmentsTotal"
            ),
            recentInvestments: this.getMinMaxMetric(
                mappedStartups,
                "recentInvestmentsTotal"
            ),
            uniqueInvestors: this.getMinMaxMetric(
                mappedStartups,
                "uniqueInvestors"
            ),
            interestingCount: this.getMinMaxMetric(
                mappedStartups,
                "interestingCount"
            ),
        }

        for (const startup of mappedStartups) {
            const score = {
                recentScore: this.calculateScore(
                    startup.recentInvestmentsTotal,
                    metrics.recentInvestments.min,
                    metrics.recentInvestments.max
                ),
                totalScore: this.calculateScore(
                    startup.investmentsTotal,
                    metrics.totalInvestments.min,
                    metrics.totalInvestments.max
                ),
                investorsScore: this.calculateScore(
                    startup.uniqueInvestors,
                    metrics.uniqueInvestors.min,
                    metrics.uniqueInvestors.max
                ),
                interestingScore: this.calculateScore(
                    startup.interestingCount,
                    metrics.interestingCount.min,
                    metrics.interestingCount.max
                ),
            }
            startupResults[startup.id] =
                score.recentScore * 0.4 +
                score.totalScore * 0.2 +
                score.investorsScore * 0.25 +
                score.interestingScore * 0.15
        }
        return mappedStartups
            .map(x => x as Startup)
            .sort((a, b) => startupResults[b.id] - startupResults[a.id])
            .slice(0, 5)
    }

    private getMinMaxMetric(
        startups: Startup[],
        key:
            | "investmentsTotal"
            | "uniqueInvestors"
            | "recentInvestmentsTotal"
            | "interestingCount"
    ) {
        const values = startups.map((x) => x[key] as number)
        return {
            min: Math.min(...values),
            max: Math.max(...values),
        }
    }

    private calculateScore(currentScore: number, min: number, max: number) {
        return ((currentScore - min) / (max - min)) * 100
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
            .andWhere("startup.stage = 'ACTIVE'")
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
            .slice(0, 5)
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
}
