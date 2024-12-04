import { FundingRound } from "./funding-round";
import { User } from "./user";
import { Expose, Type, plainToInstance } from 'class-transformer';


export class Startup extends User {
    constructor(
        title: string,
        description: string,
        fundingGoal: string,
        presentationPath: string,
        fundingRounds: FundingRound[],
        id: number, email: string, password: string
    ) {
        super(id, email, password);
        this.title = title;
        this.description = description;
        this.fundingGoal = fundingGoal;
        this.presentationPath = presentationPath;
        this.fundingRounds = fundingRounds;
    }

    title: string;

    description: string;

    @Expose({ name: 'funding_goal' })
    fundingGoal: string;

    @Expose({ name: 'presentation_path' })
    presentationPath: string;

    @Expose({ name: 'funding_rounds' })
    @Type(() => FundingRound)
    fundingRounds: FundingRound[];
}
