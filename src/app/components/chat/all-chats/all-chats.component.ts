import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../data/models/chat';
import { Roles } from '../../../constants/roles';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ChatWithUnreadCountDto } from '../../../data/dtos/responses/chat-with-unread-count.dto';
import { ChatSocketService } from '../../../services/socket/chat-socket.service';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.scss']
})
export class AllChatsComponent implements OnInit {
    constructor(private readonly chatService: ChatService,
                 readonly localStorageService: LocalStorageService,
                private readonly socket: ChatSocketService) {
    }

    chats: ChatWithUnreadCountDto[] = [];

    ngOnInit(): void {
        this.socket.onMessageArrived().subscribe(chat => {
            let index = this.chats.findIndex(x => x.id === chat.id);
            if (index == -1) {
                this.chats.push(chat);
            }
            else {
                this.chats[index] = chat;
            }
            this.sortChatsByLastMessage();
        })
        this.chatService.getChatsForUser().subscribe(chats => {
            this.chats = chats as ChatWithUnreadCountDto[];
            this.chats.forEach(chat => {
                chat.messages.forEach((message) => {
                    message.timestamp = new Date(message.timestamp)
                })
            })
            this.sortChatsByLastMessage();
        })
    }

    getMemberName(chat: Chat) {
        if (this.localStorageService.getUser()?.role === Roles.STARTUP) {
            return chat.investor.name;
        }
        else if (this.localStorageService.getUser()?.role === Roles.INVESTOR) {
            return chat.startup.title;
        }
        return "";
    }

    getUnreadMessagesCount(chat: Chat) {
        return chat.messages.filter(m => !m.readAt && m.senderType !== this.localStorageService.getUser()?.role).length;
    }

    getLastMessage(chat: Chat) {
        return chat.messages[0];
    }

    private sortChatsByLastMessage() {
        this.chats = this.chats.sort((a, b) => new Date(b.messages[0].timestamp).getTime() - new Date(a.messages[0].timestamp).getTime())
    }

    protected readonly Roles = Roles;
}
