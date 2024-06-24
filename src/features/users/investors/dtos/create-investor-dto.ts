import { IsEmail, IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class CreateInvestorDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    surname: string;
}
