import { IsDateString, IsNumberString } from "class-validator";

export class CreateFundingRoundChangeProposalDto {
    @IsNumberString()
    newFundingGoal: string;

    @IsDateString()
    newEndDate: Date;
}
