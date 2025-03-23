import { IsNumber } from "class-validator"

export class MarkNotificationAsReadDto {
    @IsNumber()
    notificationId: number;
}