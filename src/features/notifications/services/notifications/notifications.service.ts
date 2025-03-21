import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Notification } from "../../entities/notification/notification"
import { CreateNotificationDto } from "../../entities/dtos/create-notification.dto"

@Injectable()
export class NotificationsService {
    constructor(@InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>) {
    }

    saveNotification(createNotificationDto: CreateNotificationDto) {
        return this.notificationRepository.save(createNotificationDto)
    }
}
