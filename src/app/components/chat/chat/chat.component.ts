import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Chat} from "../../../data/models/chat";
import {Message} from "../../../data/models/message";
import {AppSocketService} from "../../../services/app-socket.service";
import {LocalStorageService} from "../../../services/local-storage.service";
import {Roles} from "../../../constants/roles";
import {CreateMessageDto} from "../../../data/dtos/create-message.dto";
import {last} from "rxjs";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
    constructor(private readonly route: ActivatedRoute,
                private readonly socket: AppSocketService,
                readonly localStorageService: LocalStorageService,
                private readonly router: Router,
                private readonly changeDetectorRef: ChangeDetectorRef) {
    }

    chat?: Chat;
    receiverId?: number;
    firstUnreadMessage?: Message;
    lastReadMessage?: Message;
    @ViewChild('messagesContainer') messagesContainer?: ElementRef;
    @ViewChildren('messageItem') messageItems!: QueryList<ElementRef>;

    ngOnInit(): void {
        this.socket.on("markAsRead", (msg: Message) => {
            let message = this.chat?.messages.find(x => x.id === msg.id);
            message!.readAt = msg.readAt;
            this.firstUnreadMessage = this.getFirstUnreadMessage();
            this.lastReadMessage = this.getLastReadMessage();
        })
        this.socket.on("message", (msg: Message) => {
            if (this.chat) {
                this.chat?.messages.push(msg);
                this.changeDetectorRef.detectChanges();
                this.firstUnreadMessage = this.getFirstUnreadMessage();
                this.lastReadMessage = this.getLastReadMessage();
                this.scrollChatToBottom();
            } else {
                this.router.navigate(["chats/", msg.chat.id]).then();
            }
        })
        this.route.paramMap.subscribe(params => {
            let chatId = params.get("id");
            if (chatId) {
                this.route.data.subscribe(({chat}) => {
                    this.chat = chat;
                    this.firstUnreadMessage = this.getFirstUnreadMessage();
                    this.lastReadMessage = this.getLastReadMessage();
                    this.socket.emit('joinChat', {
                        chatId: this.chat!.id,
                    });
                })
            } else {
                this.route.queryParamMap.subscribe(queryParams => {
                    if (this.localStorageService.getUser()?.payload.role === Roles.STARTUP) {
                        this.receiverId = parseInt(queryParams.get('investorId')!);
                    } else if (this.localStorageService.getUser()?.payload.role === Roles.INVESTOR) {
                        this.receiverId = parseInt(queryParams.get('startupId')!);
                    }
                });
            }
        })
    }

    getMemberName() {
        if (this.chat) {
            if (this.localStorageService.getUser()?.payload.role === Roles.STARTUP) {
                return `${this.chat.investor.name} ${this.chat.investor.surname}`;
            } else if (this.localStorageService.getUser()?.payload.role === Roles.INVESTOR) {
                return this.chat.startup.title;
            }
        }
        return "new chat"
    }

    sendMessage(message: string) {
        if (this.chat) {
            this.scrollChatToBottomForce();
            this.socket.emit('message', {
                chatId: this.chat!.id,
                text: message,
            } as CreateMessageDto);
        } else {
            console.log("Emitting new message")
            this.socket.emit('message', {
                receiverId: this.receiverId,
                text: message,
            } as CreateMessageDto);
        }
    }

    ngAfterViewInit(): void {
        this.scrollChatToBottom();
    }


    handleMarkAsRead(messageId: number) {
        this.socket.emit('markAsRead', {
            messageId: messageId,
            chatId: this.chat?.id
        });
    }

    private scrollChatToBottom() {
        if (!this.chat || !this.chat.messages) {
            return;
        }

        // const lastReadMessage = this.chat.messages.filter(m => m.readAt && m.senderType !== this.localStorageService.getUser()?.payload.role)[
        //     this.chat.messages.filter(m => m.readAt && m.senderType !== this.localStorageService.getUser()?.payload.role).length - 1];
        //
        // console.log(lastReadMessage)
        // if (!lastReadMessage || (lastReadMessage.id !== this.chat.messages[this.chat.messages.length - 1].id && lastReadMessage.senderType !== this.chat.messages[this.chat.messages.length - 1].senderType)) {
        //     this.scrollChatToBottomForce();
        //     return;
        // }

        // if (this.chat.messages.every(m => m.readAt)) {
        //     this.scrollChatToBottomForce();
        //     return;
        // }
        //
        // const firstUnreadIndex = this.chat.messages.findIndex(m => !m.readAt);
        //
        let lastReadMessage: Message;
        //
        // if (this.chat.messages[firstUnreadIndex].senderType === this.localStorageService.getUser()?.payload.role) {
        //     console.log("Мы")
        //     const readFromOther = this.chat.messages.filter(m => m.readAt && m.senderType !== this.localStorageService.getUser()?.payload.role);
        //     console.log(readFromOther)
        //     if (readFromOther.length > 0) {
        //         const last = this.chat.messages.lastIndexOf(readFromOther[readFromOther.length - 1]);
        //         lastReadMessage = this.chat.messages[last];
        //     } else {
        //         this.scrollChatToBottomForce();
        //         return;
        //     }
        // } else {
        //     // If the first unread message is from the other user,
        //     // scroll to the message immediately before it (if exists)
        //     const last = firstUnreadIndex > 0 ? firstUnreadIndex - 1 : firstUnreadIndex;
        //     lastReadMessage = this.chat.messages[last];
        // }

        const firstUnreadIndex = this.chat.messages.findIndex(m => !m.readAt);

        // If all messages are read, scroll to the bottom.
        if (firstUnreadIndex === -1) {
            this.scrollChatToBottomForce();
            return;
        }

        // If the first unread message is from the current user,
        // scroll directly to that message.
        if (this.chat.messages[firstUnreadIndex].senderType === this.localStorageService.getUser()?.payload.role) {
            lastReadMessage = this.chat.messages[firstUnreadIndex];
        } else {
            // If it's from the other user, scroll to the previous message for context.
            const index = firstUnreadIndex > 0 ? firstUnreadIndex - 1 : firstUnreadIndex;
            lastReadMessage = this.chat.messages[index];
        }

        const messageElement = this.messageItems.find(
            (el: ElementRef) => el.nativeElement.getAttribute('data-id') == lastReadMessage.id
        );

        if (messageElement) {
            this.messagesContainer!.nativeElement.scrollTop = messageElement.nativeElement.offsetTop - this.messagesContainer!.nativeElement.clientHeight + 40;
        }
    }

    private scrollChatToBottomForce() {
        this.messagesContainer!.nativeElement.scrollTop = this.messagesContainer!.nativeElement.scrollHeight;
    }

    getFirstUnreadMessage() {
        const readMessages = this.chat!.messages.filter(m => !m.readAt && m.senderType !== this.localStorageService.getUser()?.payload.role)
        return readMessages[0];
    }

    getLastReadMessage() {
        const readMessages = this.chat!.messages.filter(m => m.readAt && m.senderType === this.localStorageService.getUser()?.payload.role)
        return readMessages[readMessages.length - 1];
    }

    isLastMessage(message: Message) {
        return message.id === this.lastReadMessage!.id;
    }
}
