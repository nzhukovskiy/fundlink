import { Roles } from '../../constants/roles';
import { NotificationType } from '../../constants/notification-type';

export class Notification {
    id: number

    userId: number

    userType: Roles

    type: NotificationType

    message: string

    read: boolean

    createdAt: Date

    constructor(id: number, userId: number, userType: Roles, type: NotificationType, message: string, read: boolean, createdAt: Date) {
        this.id = id;
        this.userId = userId;
        this.userType = userType;
        this.type = type;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
    }
}
