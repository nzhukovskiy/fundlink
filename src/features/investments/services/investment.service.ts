import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvestmentDto } from "../dtos/create-investment-dto";
import { User } from "../../users/user/user";
import { InjectRepository } from "@nestjs/typeorm";
import { Investment } from "../entities/investment/investment";
import { Repository } from "typeorm";
import { FundingRoundsService } from "./funding-rounds.service";
import { Investor } from "../../users/investors/entities/investor";
import { Startup } from "../../users/startups/entities/startup";

@Injectable()
export class InvestmentService {
    constructor(@InjectRepository(Investment) private readonly investmentRepository: Repository<Investment>,
                @InjectRepository(Investor) private readonly investorRepository: Repository<Investor>,
                @InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                private readonly fundingRoundsService: FundingRoundsService) {
    }
    async create(fundingRoundId: number, createInvestmentDto: CreateInvestmentDto, investorData: User) {
        let fundingRound = await this.fundingRoundsService.getOne(fundingRoundId);
        if (!fundingRound.isCurrent) {
            throw new BadRequestException("Cannot invest in rounds that are not current");
        }
        let investor = await this.investorRepository.findOneBy({id: investorData.id});
        let investment = await this.investmentRepository.create({
            amount: createInvestmentDto.amount,
            date: new Date(),
            investor: investor,
            fundingRound: fundingRound
        })
        await this.investmentRepository.save(investment);
        fundingRound.investments.push(investment);
        await this.investmentRepository.save(fundingRound.investments);
        await this.fundingRoundsService.addFunds(fundingRound, investment.amount);
        return investment;
    }
}
