import {Investment} from "../../models/investment";
import {FundingStage} from "../../../constants/funding-stage";
import Decimal from "decimal.js";
import {Investor} from "../../models/investor";
import {FundingRound} from "../../models/funding-round";
import {InvestmentStage} from "../../../constants/investment-stage";
import {InvestmentApprovalType} from "../../../constants/investment-approval-type";

export class InvestmentFullDto extends Investment {

    startup_id: number;

    startup_title: string;

    fundingRoundStage: FundingStage;

    constructor(id: number, amount: Decimal, date: Date, investor: Investor, fundingRound: FundingRound, stage: InvestmentStage, approvalType: InvestmentApprovalType, startup_id: number, startup_title: string, fundingRoundStage: FundingStage) {
        super(id, amount, date, investor, fundingRound, stage, approvalType);
        this.startup_id = startup_id;
        this.startup_title = startup_title;
        this.fundingRoundStage = fundingRoundStage;
    }
}
