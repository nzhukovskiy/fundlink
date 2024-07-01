import { FundingStage } from "src/app/constants/funding-stage";
import { Startup } from "./startup";
import { Investment } from "./investment";

export interface FundingRound {
    id: number

    stage: FundingStage;

    fundingGoal: string;

    currentRaised: string;

    startDate: Date;

    endDate: Date;

    isCurrent: boolean;

    startup: Startup;

    investments: Investment[];
}
