import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FundingRoundChangeProposal } from "../../entities/funding-round-change-proposal/funding-round-change-proposal"
import { FundingRound } from "../../entities/funding-round/funding-round"
import {
    CreateFundingRoundChangeProposalDto,
} from "../../dtos/create-funding-round-change-proposal.dto/create-funding-round-change-proposal.dto"
import { Investor } from "../../../users/investors/entities/investor"
import { InvestorVote } from "../../entities/investor-vote/investor-vote"
import { VoteProposalDto } from "../../dtos/vote-proposal.dto/vote-proposal.dto"
import { ChangesApprovalStatus } from "../../constants/changes-approval-status"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Roles } from "../../../users/constants/roles"
import { NotificationTypes } from "../../../notifications/constants/notification-types"
import { CreateNotificationDto } from "../../../notifications/entities/dtos/create-notification.dto"

@Injectable()
export class ChangeProposalService {
    constructor(@InjectRepository(FundingRoundChangeProposal) private readonly fundingRoundChangeProposalRepository: Repository<FundingRoundChangeProposal>,
                @InjectRepository(InvestorVote) private readonly investorVoteRepository: Repository<InvestorVote>,
                @InjectRepository(FundingRound) private readonly fundingRoundRepository: Repository<FundingRound>,
                private readonly eventEmitter2: EventEmitter2) {
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
        investors.forEach(investor => {
            this.eventEmitter2.emit("notification", {
                userId: investor.id,
                userType: Roles.INVESTOR,
                type: NotificationTypes.FUNDING_ROUND_CHANGE_PROPOSAL,
                text: `Стартап ${fundingRound.startup.title} хочет внести изменения в раунд`,
                changes: savedProposal
            } as CreateNotificationDto)
        })
        return savedProposal
    }

    async vote(proposalId: number, investorId: number, voteProposalDto: VoteProposalDto) {
        const proposal = await this.fundingRoundChangeProposalRepository.findOne({
            where: { id: proposalId },
            relations: ['votes', 'votes.investor', 'fundingRound', 'fundingRound.startup']
        });
        if (proposal.status === ChangesApprovalStatus.COMPLETED) {
            throw new HttpException(
              `Voting for proposal ${proposalId} is already closed`,
              HttpStatus.CONFLICT
            );
        }

        const vote = proposal.votes.find(v => v.investor.id === investorId);
        if (!vote) {
            throw new NotFoundException("Vote does not exist");
        }
        vote.approved = voteProposalDto.approve;
        await this.investorVoteRepository.save(vote);
        await this.checkProposalComplete(proposal);
        return await this.fundingRoundChangeProposalRepository.findOne({
            where: { id: proposal.id },
            relations: ['votes', 'votes.investor', 'fundingRound']
        });
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
        this.eventEmitter2.emit("notification", {
            userId: proposal.fundingRound.startup.id,
            userType: Roles.STARTUP,
            type: NotificationTypes.FUNDING_ROUND_CHANGE_PROPOSAL_FINISHED,
            text: proposal.status === ChangesApprovalStatus.COMPLETED ? 'Изменения подтверждены' : 'Изменения отклонены',
            changes: proposal
        } as CreateNotificationDto)
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
