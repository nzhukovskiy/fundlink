import { Injectable } from '@angular/core';
import { AppHttpService } from '../app-http.service';
import { Notification } from '../../data/models/notification';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { NotificationsSocketService } from '../socket/notifications-socket.service';
import { UserService } from '../users/user.service';
import { HttpParams } from '@angular/common/http';
import { PaginationResult } from '../../data/dtos/pagination-result';

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

    getNotifications(page?: number, itemsPerPage?: number, onlyUnread?: boolean) {
        let query = new HttpParams();
        if (typeof onlyUnread !== 'undefined') {
            query = query.append('onlyUnread', onlyUnread);
        }
        if (typeof page !== 'undefined') {
            query = query.append('page', page);
        }
        if (typeof itemsPerPage !== 'undefined') {
            query = query.append('limit', itemsPerPage);
        }
        return this.appHttpService.get<PaginationResult<Notification>>(`notifications`, query);
    }

    private getUnreadNotificationsCount() {
        return this.appHttpService.get<number>(`notifications/unread-count`);
    }
}
