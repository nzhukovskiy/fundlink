export class CreateFundingRoundDto {
    fundingGoal: string;

    preMoney: string;

    startDate: Date;

    endDate: Date;

    constructor(fundingGoal: string, preMoney: string, startDate: Date, endDate: Date) {
        this.fundingGoal = fundingGoal;
        this.preMoney = preMoney;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
