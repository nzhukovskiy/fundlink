import { IsNumberString } from "class-validator";

export class CreateInvestmentDto {
    @IsNumberString()
    amount: string;
}
