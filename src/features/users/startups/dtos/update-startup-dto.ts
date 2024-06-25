import { IsEmail, IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class UpdateStartupDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNumber()
    fundingGoal: number;
}
