import { IsNumber, IsOptional } from "class-validator";

export class CreateChatDto {
    @IsNumber()
    @IsOptional()
    startupId: number;

    @IsNumber()
    @IsOptional()
    investorId: number;
}
