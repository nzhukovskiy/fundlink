import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common"
import { NotificationsService } from "../../services/notifications/notifications.service"
import { AuthGuard } from "../../../auth/guards/auth.guard"
import { Paginate, PaginateQuery } from "nestjs-paginate"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("notifications")
@ApiTags('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @ApiBearerAuth()
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

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get("unread-count")
    getUnreadNotificationsCount(@Req() req) {
        return this.notificationsService.getUnreadNotificationCount(
            req.token.payload.id,
            req.token.payload.role
        )
    }
}
