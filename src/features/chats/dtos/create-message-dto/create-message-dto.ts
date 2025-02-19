import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateMessageDto {
    @IsNumber()
    @IsOptional()
    chatId: number

    @IsNumber()
    @IsOptional()
    receiverId: number

    @IsString()
    text: string
}
