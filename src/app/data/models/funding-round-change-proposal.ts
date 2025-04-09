import {FundingRound} from "./funding-round";
import {ChangesApprovalStatus} from "../../constants/changes-approval-status";
import {InvestorVote} from "./investor-vote";

export class FundingRoundChangeProposal {
    id: number;

    fundingRound: FundingRound;

    oldFundingGoal: string;

    oldEndDate: Date;

    newFundingGoal: string;

    newEndDate: Date;

    status: ChangesApprovalStatus;

    createdAt: Date;

    votes: InvestorVote[];

    constructor(id: number, fundingRound: FundingRound, oldFundingGoal: string, oldEndDate: Date, newFundingGoal: string, newEndDate: Date, status: ChangesApprovalStatus, createdAt: Date, votes: InvestorVote[]) {
        this.id = id;
        this.fundingRound = fundingRound;
        this.oldFundingGoal = oldFundingGoal;
        this.oldEndDate = oldEndDate;
        this.newFundingGoal = newFundingGoal;
        this.newEndDate = newEndDate;
        this.status = status;
        this.createdAt = createdAt;
        this.votes = votes;
    }
}
