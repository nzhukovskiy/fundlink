import { FundingStage } from "src/app/constants/funding-stage";
import { Startup } from "./startup";
import { Investment } from "./investment";
import { Expose, Type } from "class-transformer";

export class FundingRound {
    id: number

    stage: FundingStage;

    @Expose({ name: 'funding_goal' })
    fundingGoal: string;

    @Expose({ name: 'current_raised' })
    currentRaised: string;

    @Expose({ name: 'start_date' })
    startDate: Date;

    @Expose({ name: 'end_date' })
    endDate: Date;

    @Expose({ name: 'is_current' })
    isCurrent: boolean;

    startup: Startup;

    @Expose()
    @Type(() => Investment)
    investments: Investment[];

    constructor(
        id: number,
        stage: FundingStage,
        fundingGoal: string,
        currentRaised: string,
        startDate: Date,
        endDate: Date,
        isCurrent: boolean,
        startup: Startup,
        investments: Investment[]
    ) {
        this.id = id;
        this.stage = stage;
        this.fundingGoal = fundingGoal;
        this.currentRaised = currentRaised;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isCurrent = isCurrent;
        this.startup = startup;
        this.investments = investments;
    }
}
