import { FundingStage } from "../constants/funding-stage";
import { IsDate, IsEnum, IsNumber } from "class-validator";

export class CreateFundingRoundDto {
    @IsEnum(FundingStage)
    stage: FundingStage;

    @IsNumber()
    fundingGoal: number;

    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;
}
