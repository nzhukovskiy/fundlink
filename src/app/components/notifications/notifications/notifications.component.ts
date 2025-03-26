import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { Notification } from '../../../data/models/notification';
import { NotificationsSocketService } from '../../../services/socket/notifications-socket.service';
import { NotificationType } from '../../../constants/notification-type';
import { debounceTime, filter, map, Subject, Subscription, switchMap, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
    constructor(private readonly notificationsService: NotificationsService,
                private readonly notificationsSocketService: NotificationsSocketService) {
    }

    private clickSubject = new Subject<number>();
    private subscription?: Subscription;

    private cancellationSubject = new Subject<void>();
    notifications: Notification[] = [];

    ngOnInit(): void {
        this.subscription = this.clickSubject.pipe(
            switchMap(notificationId =>
                timer(2000).pipe(
                    map(() => notificationId),
                    takeUntil(this.cancellationSubject)
                )
            )
        ).subscribe((notificationId) => {
            if (!this.notifications.find(x => x.id === notificationId)!.read) {
                this.markNotificationAsRead(notificationId);
            }
        });
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

    onNotificationPanelOpen(notificationId: number) {
        this.clickSubject.next(notificationId);
    }

    onNotificationPanelHide(notificationId: number) {
        this.clickSubject.next(0);
        this.cancellationSubject.next();
    }

    private markNotificationAsRead(notificationId: number) {
        this.notificationsSocketService.markAsRead(notificationId);
    }

    protected readonly NotificationType = NotificationType;

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
