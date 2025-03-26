import { Component } from '@angular/core';
import { NotificationBase } from '../notification-base/notification-base';
import { Roles } from '../../../constants/roles';

@Component({
  selector: 'app-message-notification',
  templateUrl: './message-notification.component.html',
  styleUrls: ['./message-notification.component.scss']
})
export class MessageNotificationComponent extends NotificationBase {

    getMessageSender() {
        const senderType = this.notification?.message?.senderType;
        if (senderType === Roles.INVESTOR) {
            return `${this.notification!.message!.chat.investor.name} ${this.notification!.message!.chat.investor.surname}`;
        }
        else {
            return this.notification!.message!.chat.startup.title;
        }
    }

}
