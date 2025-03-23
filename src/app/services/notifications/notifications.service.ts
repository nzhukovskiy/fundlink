import { Injectable } from '@angular/core';
import { AppHttpService } from '../app-http.service';
import { Notification } from '../../data/models/notification';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { NotificationsSocketService } from '../socket/notifications-socket.service';
import { UserService } from '../users/user.service';
import { User } from '../../data/models/user';
import { UserJwtInfo } from '../../data/models/user-jwt-info';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {

    private notificationsCountSubject = new BehaviorSubject(0);
    notificationsCount$ = this.notificationsCountSubject.asObservable();

    constructor(private readonly appHttpService: AppHttpService,
                private readonly notificationsSocketService: NotificationsSocketService,
                private readonly userService: UserService
                ) {
        this.userService.currentUser$.pipe(
            tap((user) => {
                if (user) {
                    this.getUnreadNotificationsCount().pipe(
                        tap((count: number) => {
                            this.notificationsCountSubject.next(count)
                        }),
                        switchMap(() => {
                            return this.notificationsSocketService.onNotificationUnreadCount().pipe(
                                tap((count => this.notificationsCountSubject.next(count)))
                            )
                        })
                    ).subscribe();
                }
                else {
                    this.notificationsCountSubject.next(0);
                }
            })
        ).subscribe()

    }

    getNotifications() {
        return this.appHttpService.get<Notification[]>(`notifications`);
    }

    private getUnreadNotificationsCount() {
        return this.appHttpService.get<number>(`notifications/unread-count`);
    }

    refreshNotificationsCount() {
        this.getUnreadNotificationsCount().subscribe(count => {
            this.notificationsCountSubject.next(count);
        });
    }

    clearNotifications() {
        this.notificationsCountSubject.next(0);
    }

}
