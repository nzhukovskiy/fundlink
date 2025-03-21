import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { AppSocketService } from './app-socket.service';
import { Message } from '../../data/models/message';
import { Notification } from '../../data/models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsSocketService extends AppSocketService {

    constructor(localStorageService: LocalStorageService) {
        super('notifications', localStorageService);
    }

    onNotification() {
        return this.fromEvent<Notification>(`notification`);
    }

    onNotificationUnreadCount() {
        return this.fromEvent<number>(`notification-unread-count`);
    }
}
