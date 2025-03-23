import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { Notification } from '../../../data/models/notification';
import { NotificationsSocketService } from '../../../services/socket/notifications-socket.service';
import { NotificationType } from '../../../constants/notification-type';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    constructor(private readonly notificationsService: NotificationsService,
                private readonly notificationsSocketService: NotificationsSocketService) {
    }

    notifications: Notification[] = [];

    ngOnInit(): void {
        this.notificationsService.getNotifications().subscribe((notifications) => {
            this.notifications = notifications;
        })
        this.notificationsSocketService.onNotification().subscribe(notification => {
            this.notifications.push(notification);
            this.sortNotifications();
        })
        this.notificationsSocketService.onMarkAsRead().subscribe(notification => {
            const idx = this.notifications.findIndex(x => x.id === notification.id);
            this.notifications[idx] = notification;
            this.sortNotifications();
        })
    }

    sortNotifications() {
        this.notifications = this.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    markNotificationAsRead(notificationId: number) {
        this.notificationsSocketService.markAsRead(notificationId);
    }

    protected readonly NotificationType = NotificationType;
}
