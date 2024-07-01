import { IsNotEmpty, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStartupDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNumberString()
    fundingGoal: string;
}
