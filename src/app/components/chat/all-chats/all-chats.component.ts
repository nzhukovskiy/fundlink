import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../data/models/chat';
import { Roles } from '../../../constants/roles';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.scss']
})
export class AllChatsComponent implements OnInit {
    constructor(private readonly chatService: ChatService,
                 readonly localStorageService: LocalStorageService) {
    }

    chats: Chat[] = [];

    ngOnInit(): void {
        this.chatService.getChatsForUser().subscribe(chats => {
            this.chats = chats;
            this.chats.forEach(chat => {
                chat.messages.forEach((message) => {
                    message.timestamp = new Date(message.timestamp)
                })
            })
            console.log(this.chats)
        })
    }

    getMemberName(chat: Chat) {
        if (this.localStorageService.getUser()?.payload.role === Roles.STARTUP) {
            return chat.investor.name;
        }
        else if (this.localStorageService.getUser()?.payload.role === Roles.INVESTOR) {
            return chat.startup.title;
        }
        return "";
    }

    getMember(chat: Chat) {
        if (this.localStorageService.getUser()?.payload.role === Roles.STARTUP) {
            return chat.investor;
        }
        else if (this.localStorageService.getUser()?.payload.role === Roles.INVESTOR) {
            return chat.startup;
        }
        return null;
    }

    getLastMessage(chat: Chat) {
        return chat.messages[0];
    }

    protected readonly Roles = Roles;
}
