import {Investor} from "./investor";
import {FundingRoundChangeProposal} from "./funding-round-change-proposal";

export class InvestorVote {
    id: number;

    investor: Investor;

    proposal: FundingRoundChangeProposal;

    approved: boolean;

    constructor(id: number, investor: Investor, proposal: FundingRoundChangeProposal, approved: boolean) {
        this.id = id;
        this.investor = investor;
        this.proposal = proposal;
        this.approved = approved;
    }
}
