import { FundingRound } from "./funding-round";
import { Investor } from "./investor";

export interface Investment {
    id: number;

    amount: string;

    date: Date;

    investor: Investor;

    fundingRound: FundingRound;
}
