import { Module } from '@nestjs/common';
import { NotificationsGateway } from './gateways/notifications/notifications.gateway';
import { NotificationsService } from './services/notifications/notifications.service';
import { JwtTokenModule } from "../token/jwt-token.module"

@Module({
  imports: [JwtTokenModule],
  providers: [NotificationsGateway, NotificationsService]
})
export class NotificationsModule {}
