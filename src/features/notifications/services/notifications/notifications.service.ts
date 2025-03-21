import { Injectable } from "@nestjs/common"
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

    saveNotification(createNotificationDto: CreateNotificationDto) {
        return this.notificationRepository.save(createNotificationDto)
    }

    getNotificationsForUser(userId: number, userType: Roles) {
        return this.notificationRepository.find({
            where: { userId, userType },
            order: {
                createdAt: "DESC",
            },
        })
    }

    getUnreadNotificationCount(userId: number, userType: Roles) {
        return this.notificationRepository.count({
            where: { userId, userType, read: false },
        })
    }
}
