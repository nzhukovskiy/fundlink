import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { BaseGateway } from "../../../../common/gateways/base/base.gateway"
import { OnEvent } from "@nestjs/event-emitter"
import { JwtTokenService } from "../../../token/services/jwt-token.service"
import { CreateNotificationDto } from "../../entities/dtos/create-notification.dto"
import { NotificationsService } from "../../services/notifications/notifications.service"

@WebSocketGateway(3001, { cors: true, namespace: "/notifications" })
export class NotificationsGateway extends BaseGateway {
    constructor(
        jwtTokenService: JwtTokenService,
        private readonly notificationService: NotificationsService
    ) {
        super(jwtTokenService)
    }
    @WebSocketServer()
    server: Server

    @SubscribeMessage("message")
    handleMessage(client: any, payload: any): string {
        return "Hello world!"
    }

    @OnEvent("notification")
    async handleNotification(payload: CreateNotificationDto) {
        const notification =
            await this.notificationService.saveNotification(payload)
        const count = await this.notificationService.getUnreadNotificationCount(
            payload.userId,
            payload.userType
        )
        this.server
            .to(`${payload.userType}-${payload.userId}`)
            .emit("notification", notification)

        this.server
            .to(`${payload.userType}-${payload.userId}`)
            .emit("notification-unread-count", count)
    }
}
