import { Column } from "typeorm";
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class CreateStartupDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNumber()
    fundingGoal: number;
}
