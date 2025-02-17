import { IsNumber, IsString } from "class-validator"

export class CreateMessageDto {
    @IsNumber()
    chatId: number;

    @IsString()
    text: string;
}
