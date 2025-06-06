import { Component } from '@angular/core';
import {NotificationBase} from "../notification-base/notification-base";
import {ExitType} from "../../../constants/exit-type";
import {Roles} from "../../../constants/roles";

@Component({
  selector: 'app-exit-notification',
  templateUrl: './exit-notification.component.html',
  styleUrls: ['./exit-notification.component.scss']
})
export class ExitNotificationComponent extends NotificationBase {

    protected readonly ExitType = ExitType;
    protected readonly Roles = Roles;
}
