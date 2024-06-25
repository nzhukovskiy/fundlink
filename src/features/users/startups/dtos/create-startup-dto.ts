import { IsEmail, MinLength } from "class-validator";
import { UpdateStartupDto } from "./update-startup-dto";

export class CreateStartupDto extends UpdateStartupDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;
}
