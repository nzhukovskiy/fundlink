import { Roles } from "../../../users/constants/roles"
import { NotificationTypes } from "../../constants/notification-types"

export class CreateNotificationDto {
    userId: number

    userType: Roles

    type: NotificationTypes

    message: string
}
