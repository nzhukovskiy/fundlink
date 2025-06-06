import { Injectable } from '@angular/core';
import { AppSocketService } from './app-socket.service';
import { LocalStorageService } from '../local-storage.service';
import { CreateMessageDto } from '../../data/dtos/create-message.dto';
import { Message } from '../../data/models/message';
import { MarkAsReadDto } from '../../data/dtos/mark-as-read.dto';
import { ChatWithUnreadCountDto } from '../../data/dtos/responses/chat-with-unread-count.dto';

@Injectable({
    providedIn: 'root',
})
export class ChatSocketService extends AppSocketService {

    constructor(localStorageService: LocalStorageService) {
        super('chats', localStorageService);
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
        return this.fromEvent<ChatWithUnreadCountDto>('messageArrived');
    }
}
