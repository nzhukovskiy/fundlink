import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FundingRoundChangeProposal } from "../../entities/funding-round-change-proposal/funding-round-change-proposal";
import { FundingRound } from "../../entities/funding-round/funding-round";
import {
    CreateFundingRoundChangeProposalDto
} from "../../dtos/create-funding-round-change-proposal.dto/create-funding-round-change-proposal.dto";
import { InvestorVoteService } from "../investor-vote-service/investor-vote.service";
import { Investor } from "../../../users/investors/entities/investor";
import { InvestorVote } from "../../entities/investor-vote/investor-vote";
import { VoteProposalDto } from "../../dtos/vote-proposal.dto/vote-proposal.dto";
import { ChangesApprovalStatus } from "../../constants/changes-approval-status";
import { FundingRoundsService } from "../funding-rounds.service";

@Injectable()
export class ChangeProposalService {
    constructor(@InjectRepository(FundingRoundChangeProposal) private readonly fundingRoundChangeProposalRepository: Repository<FundingRoundChangeProposal>,
                @InjectRepository(InvestorVote) private readonly investorVoteRepository: Repository<InvestorVote>,
                @InjectRepository(FundingRound) private readonly fundingRoundRepository: Repository<FundingRound>,
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
        const investors: Investor[] = [];
        for (const investment of fundingRound.investments) {
            if (!investors.some(x => x.id === investment.investor.id)) {
                investors.push(investment.investor);
            }
        }
        const votes = investors.map(investor =>
          this.investorVoteRepository.create({
              investor: investor,
              proposal: savedProposal
          })
        );
        await this.investorVoteRepository.save(votes);
        return savedProposal
    }

    async vote(proposalId: number, investorId: number, voteProposalDto: VoteProposalDto) {
        const proposal = await this.fundingRoundChangeProposalRepository.findOne({
            where: { id: proposalId },
            relations: ['votes', 'votes.investor', 'fundingRound']
        });

        const vote = proposal.votes.find(v => v.investor.id === investorId);
        if (!vote) {
            throw new NotFoundException("Vote does not exist");
        }
        vote.approved = voteProposalDto.approve;
        await this.investorVoteRepository.save(vote);
        await this.checkProposalComplete(proposal);
        return vote
    }

    private async checkProposalComplete(proposal: FundingRoundChangeProposal) {
        if (proposal.votes.every(v => v.approved !== null)) {
            await this.finalizeProposal(proposal);
        }
    }

    private async finalizeProposal(proposal: FundingRoundChangeProposal) {
        if (proposal.votes.every(v => v.approved)) {
            await this.applyChanges(proposal);
            proposal.status = ChangesApprovalStatus.COMPLETED;
        } else {
            proposal.status = ChangesApprovalStatus.REJECTED;
        }

        await this.fundingRoundChangeProposalRepository.save(proposal);
        //notify all
    }

    private async applyChanges(proposal: FundingRoundChangeProposal) {
        const fundingRound =  await this.fundingRoundRepository.findOne({
            where: { id: proposal.fundingRound.id },
            relations: ['startup', 'investments', 'investments.investor']
        });
        if (proposal.newFundingGoal) {
            fundingRound.fundingGoal = proposal.newFundingGoal;
        }
        if (proposal.newEndDate) {
            fundingRound.endDate = proposal.newEndDate;
        }
        await this.fundingRoundRepository.save(fundingRound);
    }
}
