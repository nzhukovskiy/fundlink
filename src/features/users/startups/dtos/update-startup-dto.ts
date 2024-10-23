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

    @ApiProperty()
    @IsNumberString()
    tam_market: string;

    @ApiProperty()
    @IsNumberString()
    sam_market: string;

    @ApiProperty()
    @IsNumberString()
    som_market: string;
}
