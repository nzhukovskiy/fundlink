import { Expose } from "class-transformer";

export class CreateFundingRoundDto {
  @Expose({ name: 'funding_goal' })
  fundingGoal: string;

  @Expose({ name: 'start_date' })
  startDate: Date;

  @Expose({ name: 'end_date' })
  endDate: Date;
  constructor(fundingGoal: string, startDate: Date, endDate: Date) {
    this.fundingGoal = fundingGoal;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
