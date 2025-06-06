import { ExitType } from "../../../constants/exit-type";
import { IsEnum, IsNumber, IsNumberString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class ExitStartupDto {
    @ApiProperty()
    @IsEnum(ExitType)
    type: ExitType;

    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    value: string;

    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    totalShares: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    lockupPeriodDays: number;
}
