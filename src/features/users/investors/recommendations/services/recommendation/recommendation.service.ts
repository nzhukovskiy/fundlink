import { Injectable, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { DataSource } from "typeorm"
import { InvestorGraphData } from "../../interfaces/investor-graph-data"
import { StartupGraphData } from "../../interfaces/startup-graph-data"
import { InvestmentQueryResult } from "../../interfaces/investment-query-result"
import { FundingRoundDto } from "../../dtos/funding-round.dto"
import { RecommendedStartupDto } from "../../dtos/recommended-startup.dto"
import { RecommendationResponseDto } from "../../dtos/recommendation-response.dto"

@Injectable()
export class RecommendationService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService
    ) {}

    async getRecommendationsForInvestor(
        investorId: number
    ): Promise<RecommendationResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()

        const rows: InvestmentQueryResult[] = await queryRunner.query(`
             SELECT
                i.id AS "investorId",
                i."name" ,
                i.surname ,
                s.id AS "startupId",
                s.title,
                s.description,
                iv.amount ,
                iv."date"
            FROM investor i
            JOIN investment iv ON i.id = iv."investorId"
            JOIN funding_round fr ON iv."fundingRoundId"  = fr.id
            JOIN startup s ON fr."startupId"  = s.id
        `)

        if (!rows || rows.length === 0) {
            return { startupWeights: {}, recommendedStartups: [] }
        }

        const investorData = new Map<number, InvestorGraphData>()
        const startupData = new Map<number, StartupGraphData>()
        const investorWeights = new Map<number, number>()
        const startupWeights = new Map<number, number>()

        for (const row of rows) {
            const currentInvestorId = Number(row.investorId)
            const currentStartupId = Number(row.startupId)
            const investmentAmount = parseInt(row.amount, 10)
            const investmentDate = new Date(row.date)

            this.constructMap(
                currentInvestorId,
                investorData,
                currentStartupId,
                { name: row.name, surname: row.surname, startups: new Map() },
                {
                    title: row.title,
                    description: row.description,
                    investments: [],
                },
                "startups",
                investmentAmount,
                investmentDate
            )

            this.constructMap(
                currentStartupId,
                startupData,
                currentInvestorId,
                {
                    title: row.title,
                    description: row.description,
                    investors: new Map(),
                },
                { name: row.name, surname: row.surname, investments: [] },
                "investors",
                investmentAmount,
                investmentDate
            )

            startupWeights.set(currentStartupId, 0)
            if (!investorWeights.has(currentInvestorId)) {
                investorWeights.set(
                    currentInvestorId,
                    currentInvestorId === investorId ? 1 : 0
                )
            }
        }

        if (!investorData.has(investorId)) {
            throw new NotFoundException(
                `Investor with ID ${investorId} has no investment history.`
            )
        }

        for (const [
            currentInvestorId,
            investorInfo,
        ] of investorData.entries()) {
            const totalInvestments =
                this.calculateTotalInvestments(investorInfo)

            if (totalInvestments === 0) {
                continue
            }

            for (const [
                startupId,
                startupInfo,
            ] of investorInfo.startups.entries()) {
                let connectionSum = 0
                for (const investment of startupInfo.investments) {
                    connectionSum += investment.investmentAmount
                }
                const weight = connectionSum / totalInvestments

                investorInfo.startups.get(startupId)!.weight = weight

                if (
                    startupData.has(startupId) &&
                    startupData.get(startupId)!.investors.has(currentInvestorId)
                ) {
                    startupData
                        .get(startupId)!
                        .investors.get(currentInvestorId)!.weight = weight
                }
            }
        }

        const iterations = 2
        for (let i = 0; i < iterations; i++) {
            this.calculatePartWeights(
                investorWeights,
                startupWeights,
                investorData,
                "startups"
            )

            const isLastCalculation = i === iterations - 1
            this.calculatePartWeights(
                startupWeights,
                investorWeights,
                startupData,
                "investors",
                isLastCalculation
            )
        }

        const targetInvestorInvestedStartupIds = investorData.get(investorId)
            ? new Set(investorData.get(investorId)!.startups.keys())
            : new Set<number>()

        const sortedStartups = Array.from(startupWeights.entries())
            .filter(
                (startup) => !targetInvestorInvestedStartupIds.has(startup[0])
            )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)

        const recommendedStartups: RecommendedStartupDto[] = []
        for (const [startupId] of sortedStartups) {
            const startupDetails = startupData.get(startupId)
            if (!startupDetails) {
                continue
            }

            const fundingRoundResult: FundingRoundDto[] =
                await queryRunner.query(
                    `SELECT * FROM funding_round WHERE "startupId" = $1 AND "isCurrent" = true LIMIT 1`,
                    [startupId]
                )

            let fundingRoundDto: FundingRoundDto | undefined = undefined
            if (fundingRoundResult && fundingRoundResult.length > 0) {
                const rawRound = fundingRoundResult[0]
                fundingRoundDto = {
                    id: rawRound.id,
                    startupId: rawRound.startupId,
                    stage: rawRound.stage,
                    fundingGoal: rawRound.fundingGoal,
                    currentRaised: rawRound.currentRaised,
                    startDate: new Date(rawRound.startDate),
                    endDate: new Date(rawRound.endDate),
                    isCurrent: rawRound.isCurrent,
                }
            }

            recommendedStartups.push({
                id: startupId,
                title: startupDetails.title,
                description: startupDetails.description,
                fundingRounds: fundingRoundDto ? [fundingRoundDto] : [],
            })
        }

        console.log(startupWeights)

        const startupWeightsObject: Record<number, number> = {}
        startupWeights.forEach((weight, id) => {
            startupWeightsObject[id] = weight
        })

        if (queryRunner) {
            await queryRunner.release()
        }

        return {
            startupWeights: startupWeightsObject,
            recommendedStartups: recommendedStartups,
        }
    }

    private constructMap(
        parentId: number,
        collection: Map<number, any>,
        childId: number,
        parentDefaults: any,
        childDefaults: any,
        childKey: string,
        investmentAmount: number,
        investmentDate: Date
    ): void {
        if (!collection.has(parentId)) {
            collection.set(parentId, { ...parentDefaults })
        }
        const parentEntry = collection.get(parentId)!

        const childrenMap = parentEntry[childKey]

        if (!childrenMap.has(childId)) {
            childrenMap.set(childId, { ...childDefaults, investments: [] })
        }
        const childEntry = childrenMap.get(childId)!

        if (!childEntry.investments) {
            childEntry.investments = []
        }
        childEntry.investments.push({
            investmentAmount: investmentAmount,
            investmentDate: investmentDate,
        })
    }

    private calculatePartWeights(
        sourceWeights: Map<number, number>,
        targetWeights: Map<number, number>,
        sourceData: any,
        targetKey: string,
        lastCalculation = false
    ): void {
        const addedWeights = new Map<number, number>()

        for (const [sourceId, sourceWeight] of sourceWeights.entries()) {
            const sourceNode = sourceData.get(sourceId)
            if (!sourceNode || sourceWeight === 0) continue

            const targets = sourceNode[targetKey]

            if (!targets || targets.size === 0) continue

            for (const [targetId, targetInfo] of targets.entries()) {
                const edgeWeight = targetInfo.weight ?? 0
                const weightToAdd = sourceWeight * edgeWeight

                if (weightToAdd > 0) {
                    addedWeights.set(
                        targetId,
                        (addedWeights.get(targetId) || 0) + weightToAdd
                    )
                }
            }
        }

        addedWeights.forEach((addWeight, targetId) => {
            targetWeights.set(
                targetId,
                (targetWeights.get(targetId) || 0) + addWeight
            )
        })

        if (!lastCalculation) {
            sourceWeights.forEach((_value, key) => {
                sourceWeights.set(key, 0)
            })
        }
    }

    private calculateTotalInvestments(investor: InvestorGraphData): number {
        let investmentsSum = 0
        if (investor.startups) {
            for (const startup of investor.startups.values()) {
                if (startup.investments) {
                    for (const investment of startup.investments) {
                        if (
                            typeof investment.investmentAmount === "number" &&
                            !isNaN(investment.investmentAmount)
                        ) {
                            investmentsSum += investment.investmentAmount
                        }
                    }
                }
            }
        }
        return investmentsSum
    }
}
