import {Injectable} from '@angular/core';
import {AppHttpService} from "./app-http.service";
import {ProposalVoteDto} from "../data/dtos/proposal-vote-dto";
import {InvestorVote} from "../data/models/investor-vote";
import {FundingRoundChangeProposal} from "../data/models/funding-round-change-proposal";

@Injectable({
    providedIn: 'root'
})
export class ProposalsService {

    constructor(private readonly appHttpService: AppHttpService) {
    }

    vote(proposalId: number, proposalVoteDto: ProposalVoteDto) {
        return this.appHttpService.post<FundingRoundChangeProposal>(`proposals/${proposalId}/vote`, proposalVoteDto)
    }
}
