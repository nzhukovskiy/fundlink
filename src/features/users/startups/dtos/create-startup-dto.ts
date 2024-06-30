import { IsEmail, MinLength } from "class-validator";
import { UpdateStartupDto } from "./update-startup-dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateStartupDto extends UpdateStartupDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @MinLength(8)
    password: string;
}
