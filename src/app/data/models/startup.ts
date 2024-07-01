import { FundingRound } from "./funding-round";
import { User } from "./user";

export interface Startup extends User {
    title: string;

    description: string;

    fundingGoal: string;

    presentationPath: string;

    fundingRounds: FundingRound[];
}
