import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

interface InvestmentDetail {
    investment_amount: number;
    investment_date: Date;
}

interface InvestorNodeData {
    name: string;
    surname: string;
    investments: InvestmentDetail[];
    weight?: number;
}

interface StartupNodeData {
    title: string;
    description: string;
    investments: InvestmentDetail[];
    weight?: number;
}

interface InvestorGraphData {
    name: string;
    surname: string;
    startups: Map<number, StartupNodeData>; // key: startupId
}

interface StartupGraphData {
    title: string;
    description: string;
    investors: Map<number, InvestorNodeData>; // key: investorId
}

// Interface for the database query result row
interface InvestmentQueryResult {
    investorId: number;
    name: string;
    surname: string;
    startupId: number;
    title: string;
    description: string;
    amount: string; // Comes as string from DB sometimes, parse later
    date: Date;
}

// Interface for Funding Round data
export interface FundingRoundDto {
    id: number;
    startupId: number;
    stage: string;
    fundingGoal: string; // Or number if appropriate
    currentRaised: string; // Or number if appropriate
    startDate: Date;
    endDate: Date;
    isCurrent: boolean;
}

// Interface for Recommended Startup data including funding round
export interface RecommendedStartupDto {
    id: number;
    title: string;
    description: string;
    // We might not need investors/investments in the final output
    // investors: Map<number, InvestorNodeData>;
    fundingRounds?: FundingRoundDto[]; // Optional, as we add it later
    // Include other startup fields if needed
}

// Interface for the final response
export interface RecommendationResponseDto {
    startupWeights: Record<number, number>; // Convert Map to plain object for JSON
    recommendedStartups: RecommendedStartupDto[];
}

// Interface for raw funding round query result
interface RawFundingRound {
    id: number;
    startupId: number;
    stage: string;
    funding_goal: string; // Adjust types if needed
    current_raised: string; // Adjust types if needed
    start_date: Date;
    end_date: Date;
    is_current: boolean;
}
@Injectable()
export class RecommendationService {
    constructor(
      private readonly dataSource: DataSource,
      private readonly configService: ConfigService,
    ) {}

    async getRecommendationsForInvestor(investorId: number): Promise<RecommendationResponseDto> {

        let queryRunner;
        // try {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();

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
            `);

            if (!rows || rows.length === 0) {
                return { startupWeights: {}, recommendedStartups: [] };
            }

            const investorData = new Map<number, InvestorGraphData>();
            const startupData = new Map<number, StartupGraphData>();
            const investorWeights = new Map<number, number>();
            const startupWeights = new Map<number, number>();

            for (const row of rows) {
                const currentInvestorId = Number(row.investorId);
                const currentStartupId = Number(row.startupId);
                const investmentAmount = parseInt(row.amount, 10);
                const investmentDate = new Date(row.date);

                if (isNaN(investmentAmount)) {
                    // continue; // Or handle as 0? Depends on requirements. Let's assume 0 for now.
                    // investmentAmount = 0; // Let's treat invalid as 0 for calculation stability
                }


                this.constructMap(
                  currentInvestorId, investorData, currentStartupId,
                  { name: row.name, surname: row.surname, startups: new Map() },
                  { title: row.title, description: row.description, investments: [] },
                  'startups', investmentAmount, investmentDate
                );

                this.constructMap(
                  currentStartupId, startupData, currentInvestorId,
                  { title: row.title, description: row.description, investors: new Map() },
                  { name: row.name, surname: row.surname, investments: [] },
                  'investors', investmentAmount, investmentDate
                );

                startupWeights.set(currentStartupId, 0);
                if (!investorWeights.has(currentInvestorId)) {
                    investorWeights.set(currentInvestorId, currentInvestorId === investorId ? 1 : 0);
                }
            }

            if (!investorData.has(investorId)) {

                throw new NotFoundException(`Investor with ID ${investorId} has no investment history.`);

                if (!investorWeights.has(investorId)) {
                    investorWeights.set(investorId, 1);
                }
            }


            for (const [currentInvestorId, investorInfo] of investorData.entries()) {
                const totalInvestments = this.calculateTotalInvestments(investorInfo);

                if (totalInvestments === 0) {
                    continue;
                }

                for (const [startupId, startupInfo] of investorInfo.startups.entries()) {
                    let connectionSum = 0;
                    for (const investment of startupInfo.investments) {
                        const timeDecay = 1; // Keeping time_decay = 1 as in Python code
                        connectionSum += timeDecay * investment.investment_amount;
                    }
                    const weight = connectionSum / totalInvestments;

                    investorInfo.startups.get(startupId)!.weight = weight;

                    if (startupData.has(startupId) && startupData.get(startupId)!.investors.has(currentInvestorId)) {
                        startupData.get(startupId)!.investors.get(currentInvestorId)!.weight = weight;
                    } else {
                    }
                }
            }

            const iterations = 2; // Same as Python code
            for (let i = 0; i < iterations; i++) {
                this.calculatePartWeights(investorWeights, startupWeights, investorData, 'startups');

                const isLastCalculation = (i === iterations - 1);
                this.calculatePartWeights(startupWeights, investorWeights, startupData, 'investors', isLastCalculation);
            }

            const targetInvestorInvestedStartupIds = investorData.get(investorId)
              ? new Set(investorData.get(investorId)!.startups.keys())
              : new Set<number>(); // Handle case where target investor has no startups

            const sortedStartups = Array.from(startupWeights.entries())
              .filter(([startupId, _weight]) => !targetInvestorInvestedStartupIds.has(startupId))
              .sort(([, weightA], [, weightB]) => weightB - weightA)
              .slice(0, 20);

            const recommendedStartups: RecommendedStartupDto[] = [];
            for (const [startupId] of sortedStartups) {
                const startupDetails = startupData.get(startupId);
                if (!startupDetails) {
                    continue;
                }

                const fundingRoundResult: RawFundingRound[] = await queryRunner.query(
                  `SELECT * FROM funding_round WHERE "startupId" = $1 AND "isCurrent" = true LIMIT 1`,
                  [startupId]
                );

                let fundingRoundDto: FundingRoundDto | undefined = undefined;
                if (fundingRoundResult && fundingRoundResult.length > 0) {
                    const rawRound = fundingRoundResult[0];
                    fundingRoundDto = {
                        id: rawRound.id,
                        startupId: rawRound.startupId,
                        stage: rawRound.stage,
                        fundingGoal: rawRound.funding_goal,
                        currentRaised: rawRound.current_raised,
                        startDate: new Date(rawRound.start_date),
                        endDate: new Date(rawRound.end_date),
                        isCurrent: rawRound.is_current,
                    };
                } else {
                }


                recommendedStartups.push({
                    id: startupId,
                    title: startupDetails.title,
                    description: startupDetails.description,
                    fundingRounds: fundingRoundDto ? [fundingRoundDto] : [],
                });
            }

            const startupWeightsObject: Record<number, number> = {};
            startupWeights.forEach((weight, id) => {
                startupWeightsObject[id] = weight;
            });


            return {
                // startupWeights: startupWeights, // Return the final weights if needed
                startupWeights: startupWeightsObject,
                recommendedStartups: recommendedStartups,
            };

        // } catch (error) {
        //     if (error instanceof NotFoundException) {
        //         throw error;
        //     }
        //     throw new InternalServerErrorException('Failed to calculate recommendations.');
        // } finally {
        //     if (queryRunner) {
        //         await queryRunner.release();
        //     }
        // }
    }

    private constructMap<P_ID, C_ID, P_Data, C_Data, ChildKey extends keyof P_Data>(
      parentId: P_ID,
      collection: Map<P_ID, P_Data>,
      childId: C_ID,
      parentDefaults: P_Data,
      childDefaults: C_Data & { investments: InvestmentDetail[] },
      childKey: ChildKey,
      investmentAmount: number,
      investmentDate: Date
    ): void {
        if (!collection.has(parentId)) {
            collection.set(parentId, { ...parentDefaults });
        }
        const parentEntry = collection.get(parentId)!;


        const childrenMap = parentEntry[childKey] as unknown as Map<C_ID, C_Data & { investments: InvestmentDetail[] }>;

        if (!childrenMap.has(childId)) {
            childrenMap.set(childId, { ...childDefaults, investments: [] });
        }
        const childEntry = childrenMap.get(childId)!;

        if (!childEntry.investments) {
            childEntry.investments = [];
        }
        childEntry.investments.push({ investment_amount: investmentAmount, investment_date: investmentDate });
    }


    private calculatePartWeights<SourceId, TargetId>(
      sourceWeights: Map<SourceId, number>,
      targetWeights: Map<TargetId, number>,
      sourceData: any,
      targetKey: string, // e.g., 'startups' or 'investors'
      lastCalculation = false
    ): void {
        const addedWeights = new Map<TargetId, number>();

        for (const [sourceId, sourceWeight] of sourceWeights.entries()) {
            const sourceNode = sourceData.get(sourceId);
            if (!sourceNode || sourceWeight === 0) continue;

            const targets = sourceNode[targetKey] as Map<TargetId, { weight?: number }>;
            if (!targets || targets.size === 0) continue;

            const numTargets = targets.size;

            for (const [targetId, targetInfo] of targets.entries()) {
                const edgeWeight = targetInfo.weight ?? 0;
                const weightToAdd = (sourceWeight * edgeWeight) // numTargets;

                if (weightToAdd > 0) {
                    addedWeights.set(targetId, (addedWeights.get(targetId) || 0) + weightToAdd);
                }
            }
        }

        addedWeights.forEach((addWeight, targetId) => {
            targetWeights.set(targetId, (targetWeights.get(targetId) || 0) + addWeight);
        });


        if (!lastCalculation) {
            sourceWeights.forEach((_value, key) => {
                sourceWeights.set(key, 0);
            });
        }
    }

    private calculateTotalInvestments(investor: InvestorGraphData): number {
        let investmentsSum = 0;
        if (investor.startups) {
            for (const startup of investor.startups.values()) {
                if (startup.investments) {
                    for (const investment of startup.investments) {
                        if (typeof investment.investment_amount === 'number' && !isNaN(investment.investment_amount)) {
                            investmentsSum += investment.investment_amount;
                        }
                    }
                }
            }
        }
        return investmentsSum;
    }
}
