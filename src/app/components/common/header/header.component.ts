import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Roles } from '../../../constants/roles';
import { UserJwtInfo } from '../../../data/models/user-jwt-info';
import { investorResolver } from '../../../resolvers/investor.resolver';
import { NotificationsSocketService } from '../../../services/socket/notifications-socket.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { UserService } from '../../../services/users/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor(protected readonly notificationsService: NotificationsService,
                protected readonly userService: UserService) {}

    protected readonly Roles = Roles;

    ngOnInit(): void {
    }
}
