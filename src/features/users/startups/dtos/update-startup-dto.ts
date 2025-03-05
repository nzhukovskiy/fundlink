import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray, IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStartupDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsOptional()
    logoPath: string;

    @ApiProperty()
    @IsBoolean()
    autoApproveInvestments: boolean;

    @ApiProperty()
    @IsNumberString()
    fundingGoal: string;

    @ApiProperty()
    @IsNumber()
    teamExperience: number;

    @ApiProperty()
    @IsNumberString()
    tamMarket: string;

    @ApiProperty()
    @IsNumberString()
    samMarket: string;

    @ApiProperty()
    @IsNumberString()
    somMarket: string;

    @ApiProperty()
    @IsOptional()
    @IsNumberString()
    debtAmount: string;

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(5)
    @ArrayMaxSize(5)
    @IsInt({ each: true })
    revenuePerYear?: string[];

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(5)
    @ArrayMaxSize(5)
    @IsInt({ each: true })
    capitalExpenditures?: string[];

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(5)
    @ArrayMaxSize(5)
    @IsInt({ each: true })
    changesInWorkingCapital?: string[];

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(5)
    @ArrayMaxSize(5)
    @IsInt({ each: true })
    deprecationAndAmortization?: string[];
}
