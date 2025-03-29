import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Notification } from "../../entities/notification/notification"
import { CreateNotificationDto } from "../../entities/dtos/create-notification.dto"
import { Roles } from "../../../users/constants/roles"

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>
    ) {}

    async saveNotification(createNotificationDto: CreateNotificationDto) {
        const notification = await this.notificationRepository.save(createNotificationDto)
        return this.notificationRepository.findOne({
            where: { id: notification.id },
            relations: ["investment", "message", "investment.investor", "message.chat"]
        })
    }

    getNotificationsForUser(userId: number, userType: Roles) {
        return this.notificationRepository.find({
            where: { userId, userType },
            order: {
                createdAt: "DESC",
            },
            relations: ["investment", "message", "investment.investor", "message.chat", "investment.fundingRound"]
        })
    }

    getUnreadNotificationCount(userId: number, userType: Roles) {
        return this.notificationRepository.count({
            where: { userId, userType, read: false },
        })
    }

    async markAsRead(notificationId: number, userId: number, userRole: Roles) {
        const notification = await this.notificationRepository.findOneBy({
            id: notificationId,
        })
        if (!notification) {
            throw new NotFoundException(
                `Notification with id ${notificationId} does not exist`
            )
        }
        if (
            notification.userId !== userId ||
            notification.userType !== userRole
        ) {
            throw new UnauthorizedException(
                "You are not allowed to perform this action"
            )
        }
        notification.read = true
        const updatedNotification = await this.notificationRepository.save(notification)
        return this.notificationRepository.findOne({
            where: { id: updatedNotification.id },
            relations: ["investment", "message", "investment.investor", "message.chat"]
        })
    }
}
