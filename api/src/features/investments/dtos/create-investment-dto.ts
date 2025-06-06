import { IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateInvestmentDto {
    @ApiProperty()
    @IsNumberString()
    amount: string;
}
