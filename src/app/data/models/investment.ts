import { FundingRound } from "./funding-round";
import { Investor } from "./investor";

export class Investment {
    id: number;

    amount: string;

    date: Date;

    investor: Investor;

    fundingRound: FundingRound;

    startup_id: number;

    startup_title: string;

    constructor(
        id: number,
        amount: string,
        date: Date,
        investor: Investor,
        fundingRound: FundingRound,
        startup_id: number,
        startup_title: string
    ) {
        this.id = id;
        this.amount = amount;
        this.date = date;
        this.investor = investor;
        this.fundingRound = fundingRound;
        this.startup_id = startup_id;
        this.startup_title = startup_title;
    }
}
