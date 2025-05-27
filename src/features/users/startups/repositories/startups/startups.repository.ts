import { Injectable } from "@nestjs/common";
import { PaginateQuery } from "nestjs-paginate";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../../entities/startup.entity";
import { Repository } from "typeorm";
import { PaginateService } from "../../../../../common/paginate/services/paginate/paginate.service";
import Decimal from "decimal.js";
import { InvestmentStage } from "../../../../investments/constants/investment-stage";
import { FundingStage } from "../../../../investments/constants/funding-stage";

@Injectable()
export class StartupsRepository {

    constructor(
        @InjectRepository(Startup)
        private readonly startupRepository: Repository<Startup>,
        private readonly paginateService: PaginateService,
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
        return startupQuery
            .where("startup.id = :id", { id })
            .orderBy("fundingRound.startDate", "ASC")
            .leftJoinAndSelect("startup.tags", "tag")
            .leftJoinAndSelect("startup.exit", "exit")
            .where("startup.id = :id", { id })
            .getRawAndEntities()
    }


    getStartupsForInvestor(investorId: number) {
       return this.startupRepository
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
         .addSelect(
           `(SELECT SUM(funding_round_sub."preMoney")
            FROM funding_round funding_round_sub
            WHERE funding_round_sub."startupId" = startup.id) AS "preMoney"`
         )
          .innerJoin("fundingRound.investments", "investment")
          .innerJoin("investment.investor", "investor")
          .where("investor.id = :id", { id: investorId })
          .andWhere("investment.stage = 'COMPLETED'")
          .groupBy("startup.id")
          .getRawMany()
    }

    getStartupsCountForInvestor(investorId: number) {
        return this.startupRepository
          .createQueryBuilder("startup")
          .leftJoin("startup.fundingRounds", "fundingRound")
          .leftJoin("fundingRound.investments", "investment")
          .leftJoinAndSelect("investment.investor", "investor")
          .where("investor.id = :id", { id: investorId })
          .andWhere("investment.stage = 'COMPLETED'")
          .getCount()
    }

    calculateInvestorShareForStartup(
      investorId: number,
      startupId: number
    ) {
        return this.startupRepository
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

    async calculateInvestorShareWithStartupShare(investorId: number, startupId: number) {
        const startup = await this.getOne(startupId, true)
        let currentShare = new Decimal(0)
        let wereInvestments = false
        for (const fundingRound of startup.entities[0].fundingRounds) {
            const dilutionFactor =
              fundingRound.stage === FundingStage.SEED ?
                new Decimal(1) :
                new Decimal(fundingRound.preMoney).div(new Decimal(fundingRound.preMoney).plus(fundingRound.currentRaised))
            if (fundingRound.currentRaised === "0") {
                continue
            }
            const currentInvestments = fundingRound.investments
              .filter(x => x.stage === InvestmentStage.COMPLETED)
              .filter(x => x.investor.id === investorId);
            console.log("using df", dilutionFactor)
            if (!currentInvestments.length) {
                if (wereInvestments) {
                    currentShare = currentShare.mul(dilutionFactor)
                }
                continue
            }
            wereInvestments = true
            const added = (currentInvestments
              .reduce((acc, x) => acc.plus(x.amount) , new Decimal(0))).div(
              new Decimal(fundingRound.currentRaised).plus(fundingRound.preMoney))
            console.log("added", added)
            currentShare = currentShare.mul(dilutionFactor)
             currentShare = currentShare.plus(added)

            console.log(`premoney: ${fundingRound.preMoney}, currentRaised: ${fundingRound.currentRaised}`)

            console.log("calculated new df", dilutionFactor)
            console.log(`share of investor ${investorId} in round ${fundingRound.stage} = ${currentShare}`)
        }
        return currentShare
    }

    async calculateStartupsShare(startupId: number) {
        const startup = await this.getOne(startupId, true)
        let currentShare = new Decimal(0)
        for (const fundingRound of startup.entities[0].fundingRounds) {
            const dilutionFactor =
              fundingRound.stage === FundingStage.SEED ?
                new Decimal(1) :
                new Decimal(fundingRound.preMoney).div(new Decimal(fundingRound.preMoney).plus(fundingRound.currentRaised))
            if (fundingRound.currentRaised === "0") {
                continue
            }

            currentShare = fundingRound.stage === FundingStage.SEED ?
              new Decimal(fundingRound.preMoney).div(
                new Decimal(fundingRound.currentRaised).plus(fundingRound.preMoney)) :
              currentShare = currentShare.mul(dilutionFactor)


            console.log(`premoney: ${fundingRound.preMoney}, currentRaised: ${fundingRound.currentRaised}`)

            console.log("calculated new df", dilutionFactor)
            console.log(`share of startup ${startupId} in round ${fundingRound.stage} = ${currentShare}`)
        }
        return currentShare
    }
}