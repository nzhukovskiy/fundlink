import { IsNumber } from "class-validator"

export class ChatBetweenUsersDto {
    @IsNumber()
    startupId: number

    @IsNumber()
    investorId: number
}
