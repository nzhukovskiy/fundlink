import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FundingRoundChangeProposal } from "../../entities/funding-round-change-proposal/funding-round-change-proposal";
import { FundingRound } from "../../entities/funding-round/funding-round";
import {
    CreateFundingRoundChangeProposalDto
} from "../../dtos/create-funding-round-change-proposal.dto/create-funding-round-change-proposal.dto";
import { InvestorVoteService } from "../investor-vote-service/investor-vote.service";

@Injectable()
export class ChangeProposalService {
    constructor(@InjectRepository(FundingRoundChangeProposal) private readonly fundingRoundChangeProposalRepository: Repository<FundingRoundChangeProposal>,
                private readonly investorVoteService: InvestorVoteService) {
    }


    async create(fundingRound: FundingRound, createFundingRoundChangeProposalDto: CreateFundingRoundChangeProposalDto) {
        const proposal = await this.fundingRoundChangeProposalRepository.create({
            fundingRound: fundingRound,
            oldFundingGoal: fundingRound.fundingGoal,
            oldEndDate: fundingRound.endDate,
            newFundingGoal: createFundingRoundChangeProposalDto.newFundingGoal ?? undefined,
            newEndDate: createFundingRoundChangeProposalDto.newEndDate ?? undefined,
        })

        const savedProposal = await this.fundingRoundChangeProposalRepository.save(proposal)
        for (const investment of fundingRound.investments) {
            await this.investorVoteService.create(investment.investor, savedProposal)
        }

        return savedProposal
    }

}
