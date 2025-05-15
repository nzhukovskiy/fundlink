import { FundingRound } from "./funding-round";
import { Investor } from "./investor";
import {InvestmentStage} from "../../constants/investment-stage";
import {InvestmentApprovalType} from "../../constants/investment-approval-type";
import Decimal from 'decimal.js';

export class Investment {
    id: number;

    amount: Decimal;

    date: Date;

    investor: Investor;

    fundingRound: FundingRound;

    stage: InvestmentStage;

    approvalType: InvestmentApprovalType;

    constructor(id: number, amount: Decimal, date: Date, investor: Investor, fundingRound: FundingRound, stage: InvestmentStage, approvalType: InvestmentApprovalType) {
        this.id = id;
        this.amount = amount;
        this.date = date;
        this.investor = investor;
        this.fundingRound = fundingRound;
        this.stage = stage;
        this.approvalType = approvalType;
    }
}
