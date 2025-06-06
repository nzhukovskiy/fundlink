import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { UpdateInvestorDto } from "./update-investor-dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateInvestorDto extends UpdateInvestorDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @MinLength(8)
    password: string;
}
