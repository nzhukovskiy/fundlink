import { Component } from '@angular/core';
import { Roles } from '../../../constants/roles';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { UserService } from '../../../services/users/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    constructor(protected readonly notificationsService: NotificationsService,
                protected readonly userService: UserService) {}

    protected readonly Roles = Roles;
    protected readonly navigator = navigator;
    protected readonly matchMedia = matchMedia;
}
