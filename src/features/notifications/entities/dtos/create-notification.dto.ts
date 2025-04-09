import { Roles } from "../../../users/constants/roles"
import { NotificationTypes } from "../../constants/notification-types"
import { Message } from "../../../chats/entities/message/message"
import { Investment } from "../../../investments/entities/investment/investment"
import {
    FundingRoundChangeProposal
} from "../../../investments/entities/funding-round-change-proposal/funding-round-change-proposal";

export class CreateNotificationDto {
    userId: number

    userType: Roles

    type: NotificationTypes

    text: string

    message?: Message

    investment?: Investment

    changes?: FundingRoundChangeProposal
}
