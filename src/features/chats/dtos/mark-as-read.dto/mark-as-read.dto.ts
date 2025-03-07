import { IsNumber } from "class-validator";

export class MarkAsReadDto {
    @IsNumber()
    messageId: number;
}
