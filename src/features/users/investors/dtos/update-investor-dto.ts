import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UpdateInvestorDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    surname: string;
}
