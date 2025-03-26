import { Component } from '@angular/core';
import { NotificationBase } from '../notification-base/notification-base';
import { NotificationType } from '../../../constants/notification-type';

@Component({
  selector: 'app-investment-notification',
  templateUrl: './investment-notification.component.html',
  styleUrls: ['./investment-notification.component.scss']
})
export class InvestmentNotificationComponent extends NotificationBase {

    protected readonly NotificationType = NotificationType;
}
