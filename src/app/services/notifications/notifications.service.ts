import { Injectable } from '@angular/core';
import { AppHttpService } from '../app-http.service';
import { Notification } from '../../data/models/notification';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {

    constructor(private readonly appHttpService: AppHttpService) {
    }

    getNotifications() {
        return this.appHttpService.get<Notification[]>(`notifications`);
    }

    getUnreadNotificationsCount() {
        return this.appHttpService.get<number>(`notifications/unread-count`);
    }

}
