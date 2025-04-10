import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { Notification } from '../../../data/models/notification';
import { NotificationsSocketService } from '../../../services/socket/notifications-socket.service';
import { NotificationType } from '../../../constants/notification-type';
import { debounceTime, filter, map, Subject, Subscription, switchMap, takeUntil, timer } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import {ChangesApprovalStatus} from "../../../constants/changes-approval-status";

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

    totalNotificationsNumber: number = 0;
    pageSize = 8;
    pageIndex = 0;

    onlyUnread = new FormControl(false);

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
        this.onlyUnread.valueChanges.subscribe(value => {
            this.notificationsService.getNotifications(this.pageIndex, this.pageSize, value!).subscribe(res => {
                this.notifications = res.data;
                this.totalNotificationsNumber = res.meta.totalItems;
            });
        })
        this.notificationsService.getNotifications().subscribe((notifications) => {
            this.notifications = notifications.data;
            this.totalNotificationsNumber = notifications.meta.totalItems;
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
        this.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

    trackByNotificationId(index: number, notification: Notification): number {
        return notification.id;
    }

    handlePageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.notificationsService.getNotifications(event.pageIndex + 1, event.pageSize, false).subscribe(res => {
            this.notifications = res.data;
            this.totalNotificationsNumber = res.meta.totalItems;
        });
    }

    protected readonly ChangesApprovalStatus = ChangesApprovalStatus;
}
