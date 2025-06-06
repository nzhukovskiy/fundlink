import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { AppSocketService } from './app-socket.service';
import { Notification } from '../../data/models/notification';
import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationsSocketService extends AppSocketService {

    constructor(localStorageService: LocalStorageService,
                private readonly toastrService: ToastrService) {
        super('notifications', localStorageService);
    }

    onNotification() {
        return this.fromEvent<Notification>(`notification`).pipe(tap(x => {
            this.toastrService.info("Новое уведомление!")
        }));
    }

    onNotificationUnreadCount() {
        return this.fromEvent<number>(`notification-unread-count`);
    }

    markAsRead(notificationId: number) {
        this.emit('mark-as-read', {notificationId});
    }

    onMarkAsRead() {
        return this.fromEvent<Notification>(`mark-as-read`);
    }
}
