import { IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChatDto {
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    startupId: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    investorId: number;
}
