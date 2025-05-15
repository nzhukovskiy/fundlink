import { InjectRepository } from "@nestjs/typeorm";
import { Investment } from "../../entities/investment/investment";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InvestmentsRepository {

    constructor(@InjectRepository(Investment) private readonly investmentRepository: Repository<Investment>,) {
    }

    getInvestmentsForInvestor(investorId: number) {
        return this.investmentRepository
          .createQueryBuilder("investment")
          .innerJoin("investment.fundingRound", "fundingRound")
          .innerJoin("fundingRound.startup", "startup")
          .where("investment.investorId = :id", { id: investorId })
          .select([
              "investment.id as id",
              "investment.amount as amount",
              "investment.date as date",
              'investment.approvalType as "approvalType"',
              "investment.stage as stage",
              'fundingRound.stage as "fundingRoundStage"',
              "startup.id",
              "startup.title",
          ])
          .orderBy("investment.date", "ASC")
          .getRawMany()
    }

    getLastInvestmentDateForInvestor(investorId: number) {
        return this.investmentRepository
          .createQueryBuilder("investment")
          .leftJoin("investment.investor", "investor")
          .where("investor.id = :id", { id: investorId })
          .andWhere("investment.stage = 'COMPLETED'")
          .take(1)
          .orderBy("investment.date", "DESC")
          .getOne()
    }
}
