import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Roles } from '../../../constants/roles';
import { UserJwtInfo } from '../../../data/models/user-jwt-info';
import { investorResolver } from '../../../resolvers/investor.resolver';
import { NotificationsSocketService } from '../../../services/socket/notifications-socket.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor(readonly localStorageService: LocalStorageService,
                private readonly socket: NotificationsSocketService,
                private readonly notificationsService: NotificationsService,) {}

    currentUser?: UserJwtInfo;
    protected readonly Roles = Roles;
    unreadNotificationsCounter = 0;

    ngOnInit(): void {
        this.currentUser = this.localStorageService.getUser();
        this.notificationsService.getUnreadNotificationsCount().subscribe(count => {
            this.unreadNotificationsCounter = count
        })
        this.socket.onNotificationUnreadCount().subscribe((count) => {
            this.unreadNotificationsCounter = count
        })
    }
}
