import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common"
import { NotificationsService } from "../../services/notifications/notifications.service"
import { AuthGuard } from "../../../auth/guards/auth.guard"
import { Paginate, PaginateQuery } from "nestjs-paginate"

@Controller("notifications")
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @UseGuards(AuthGuard)
    @Get("")
    getNotifications(@Paginate() query: PaginateQuery, @Req() req, @Query("onlyUnread") onlyUnread: boolean) {
        return this.notificationsService.getNotificationsForUser(
            query,
            req.token.payload.id,
            req.token.payload.role,
            onlyUnread
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
