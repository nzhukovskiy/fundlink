import { IsDateString, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFundingRoundDto {
    @ApiProperty()
    @IsNumberString()
    fundingGoal: string;

    @ApiProperty()
    @IsDateString()
    startDate: Date;

    @ApiProperty()
    @IsDateString()
    endDate: Date;
}
