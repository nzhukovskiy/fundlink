import { Controller, Get, Req, UseGuards } from "@nestjs/common"
import { NotificationsService } from "../../services/notifications/notifications.service"
import { AuthGuard } from "../../../auth/guards/auth.guard"

@Controller("notifications")
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @UseGuards(AuthGuard)
    @Get("")
    getNotifications(@Req() req) {
        return this.notificationsService.getNotificationsForUser(
            req.token.payload.id,
            req.token.payload.role
        )
    }

    @UseGuards(AuthGuard)
    @Get("unread-count")
    getUnreadNotificationsCount(@Req() req) {
        return this.notificationsService.getUnreadNotificationCount(
            req.token.payload.id,
            req.token.payload.role
        )
    }
}
