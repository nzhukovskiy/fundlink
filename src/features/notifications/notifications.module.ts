import { Module } from "@nestjs/common"
import { NotificationsGateway } from "./gateways/notifications/notifications.gateway"
import { NotificationsService } from "./services/notifications/notifications.service"
import { JwtTokenModule } from "../token/jwt-token.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Notification } from "./entities/notification/notification"
import { NotificationsController } from './controllers/notifications/notifications.controller';

@Module({
    imports: [JwtTokenModule, TypeOrmModule.forFeature([Notification])],
    providers: [NotificationsGateway, NotificationsService],
    controllers: [NotificationsController],
})
export class NotificationsModule {}
