import { FundingRound } from "./funding-round";
import { User } from "./user";

export interface Startup extends User {
    title: string;

    description: string;

    fundingGoal: string;

    tam_market: string;

    sam_market: string;

    som_market: string;

    presentationPath: string;

    fundingRounds: FundingRound[];
}
