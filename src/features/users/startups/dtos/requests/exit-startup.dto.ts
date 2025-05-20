import { ExitType } from "../../../constants/exit-type";
import { IsEnum, IsNumberString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ExitStartupDto {
    @ApiProperty()
    @IsEnum(ExitType)
    type: ExitType;

    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    value: string;
}
