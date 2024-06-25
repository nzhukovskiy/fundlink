import { IsEmail, IsNotEmpty, IsNumber, MinLength } from "class-validator";
import { UpdateInvestorDto } from "./update-investor-dto";

export class CreateInvestorDto extends UpdateInvestorDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;
}
