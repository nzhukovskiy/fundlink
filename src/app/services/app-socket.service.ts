import {Injectable} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {LocalStorageService} from "./local-storage.service";
import {CreateMessageDto} from "../data/dtos/create-message.dto";
import {Message} from "../data/models/message";
import {MarkAsReadDto} from "../data/dtos/mark-as-read.dto";
import {Chat} from "../data/models/chat";
import {ChatWithUnreadCountDto} from "../data/dtos/responses/chat-with-unread-count.dto";

@Injectable({
    providedIn: 'root'
})
export class AppSocketService extends Socket {

    constructor(private readonly localStorageService: LocalStorageService) {
        super({
            url: 'http://localhost:3001',
            options: {
                auth: {
                    token: localStorageService.getToken() || '',
                },
            },
        });
    }

    joinChat(chatId: number) {
        this.emit('joinChat', {
            chatId: chatId,
        });
    }

    sendMessage(createMessageDto: CreateMessageDto) {
        this.emit('message', createMessageDto);
    }

    onNewMessage() {
        return this.fromEvent<Message>(`message`);
    }

    markAsRead(markAsReadDto: MarkAsReadDto) {
        this.emit('markAsRead', markAsReadDto);
    }

    onReadStateChange() {
        return this.fromEvent<Message>(`markAsRead`);
    }

    onUnreadCount() {
        return this.fromEvent<number>('unreadCount');
    }

    onMessageArrived() {
        return this.fromEvent<ChatWithUnreadCountDto>("messageArrived");
    }
}
