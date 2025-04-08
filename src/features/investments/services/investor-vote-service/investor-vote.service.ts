import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InvestorVote } from "../../entities/investor-vote/investor-vote";
import { Investor } from "../../../users/investors/entities/investor";
import { FundingRoundChangeProposal } from "../../entities/funding-round-change-proposal/funding-round-change-proposal";

@Injectable()
export class InvestorVoteService {
    constructor(@InjectRepository(InvestorVote) private readonly investorVoteRepository: Repository<InvestorVote>) {
    }

    async create(investor: Investor, proposal: FundingRoundChangeProposal) {
        if (!(await this.investorVoteRepository.findOneBy(
          {
              investor: {
                    id: investor.id
              },
              proposal: {
                    id: proposal.id
              }
          }))) {
            const vote = this.investorVoteRepository.create({
                investor: investor,
                proposal: proposal
            })
            console.log(vote)

            return this.investorVoteRepository.save(vote)
        }
    }
}
