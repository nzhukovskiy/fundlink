import { Expose } from "class-transformer";

export class CreateFundingRoundDto {
  fundingGoal: string;

  startDate: Date;

  endDate: Date;
  constructor(fundingGoal: string, startDate: Date, endDate: Date) {
    this.fundingGoal = fundingGoal;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
