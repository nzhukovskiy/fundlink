import { IsDateString, IsNumberString } from "class-validator";

export class CreateFundingRoundDto {
    @IsNumberString()
    fundingGoal: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;
}
