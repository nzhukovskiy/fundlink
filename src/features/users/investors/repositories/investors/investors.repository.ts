import { InjectRepository } from "@nestjs/typeorm";
import { Investor } from "../../entities/investor";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InvestorsRepository {

    constructor(@InjectRepository(Investor)
                private readonly investorRepository: Repository<Investor>,) {
    }

    getInvestorsForStartup(startupId: number, fundingRoundId?: number) {
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
          .where(whereClause, { id: startupId, fundingRoundId })
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

    async getAverageInvestmentAmount(investorId: number) {
        return (await this.investorRepository
          .createQueryBuilder("investor")
          .leftJoinAndSelect("investor.investments", "investment")
          .select("AVG(investment.amount) as avg")
          .where("investor.id = :id", { id: investorId })
          .andWhere("investment.stage = 'COMPLETED'")
          .getRawOne()) as {avg: number}
    }
}
