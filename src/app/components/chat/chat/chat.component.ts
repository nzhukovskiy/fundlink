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
    @ViewChild('unreadMessagesLabel' ) unreadMessagesLabel?: ElementRef;

    ngOnInit(): void {
        this.socket.onReadStateChange().subscribe(msg => {
            let message = this.chat?.messages.find(x => x.id === msg.id);
            message!.readAt = msg.readAt;
            this.firstUnreadMessage = this.getFirstUnreadMessage();
            this.lastReadMessage = this.getLastReadMessage();
        })
        this.socket.onNewMessage().subscribe(msg => {
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
                    this.socket.joinChat(this.chat!.id);
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
            this.socket.sendMessage({chatId: this.chat!.id, text: message} as CreateMessageDto)
        } else {
            this.socket.sendMessage({receiverId: this.receiverId, text: message} as CreateMessageDto)
        }
    }

    ngAfterViewInit(): void {
        this.scrollChatToBottom();
    }


    handleMarkAsRead(messageId: number) {
        this.socket.markAsRead({messageId: messageId, chatId: this.chat!.id});
    }

    private scrollChatToBottom() {
        if (!this.chat || !this.chat.messages) {
            return;
        }
        let lastReadMessage: Message;

        const firstUnreadIndex = this.chat.messages.findIndex(m => !m.readAt);
        if (firstUnreadIndex === -1) {
            this.scrollChatToBottomForce();
            return;
        }

        if (this.chat.messages[firstUnreadIndex].senderType === this.localStorageService.getUser()?.payload.role) {
            lastReadMessage = this.chat.messages[firstUnreadIndex];
            this.scrollChatToBottomForce();
            return;
        } else {
            const index = firstUnreadIndex > 0 ? firstUnreadIndex - 1 : firstUnreadIndex;
            lastReadMessage = this.chat.messages[index];
        }



        const messageElement = this.messageItems.find(
            (el: ElementRef) => el.nativeElement.getAttribute('data-id') == lastReadMessage.id
        );

        const additionalScroll = this.unreadMessagesLabel ? this.unreadMessagesLabel.nativeElement.clientHeight : 0;
        if (messageElement) {
            this.messagesContainer!.nativeElement.scrollTop = messageElement.nativeElement.offsetTop - this.messagesContainer!.nativeElement.clientHeight + messageElement.nativeElement.clientHeight + additionalScroll;
        }
    }

    private scrollChatToBottomForce() {
        console.log("force")
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
        return !!this.lastReadMessage && message.id === this.lastReadMessage!.id;
    }
}
