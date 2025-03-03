import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Chat} from "../../../data/models/chat";
import {Message} from "../../../data/models/message";
import {AppSocketService} from "../../../services/app-socket.service";
import {LocalStorageService} from "../../../services/local-storage.service";
import {Roles} from "../../../constants/roles";
import {CreateMessageDto} from "../../../data/dtos/create-message.dto";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  constructor(private readonly chatService: ChatService,
              private readonly route: ActivatedRoute,
              private readonly socket: AppSocketService,
              readonly localStorageService: LocalStorageService,
              private readonly router: Router,
              private readonly changeDetectorRef: ChangeDetectorRef) { }
    chat?: Chat;
    receiverId?: number;
    @ViewChild('messagesContainer') messagesContainer?: ElementRef;

  ngOnInit(): void {
      this.socket.on("message", (msg: Message) => {
          if (this.chat) {
              this.chat?.messages.push(msg);
              this.changeDetectorRef.detectChanges();
              this.scrollChatToBottom();
          }
          else {
              this.router.navigate(["chats/", msg.chat.id]).then();
          }
      })
      this.route.paramMap.subscribe(params => {
          let chatId = params.get("id");
          if (chatId) {
              this.route.data.subscribe(({chat}) => {
                  this.chat = chat;
                  this.socket.emit('joinChat', {
                      chatId: this.chat!.id,
                  });
              })
        // this.chatService.getChat(parseInt(chatId)).subscribe(res => {
        //   this.chat = res;
        //   this.socket.emit('joinChat', {
        //     chatId: this.chat.id,
        //   });
        // })
          }
          else {
              this.route.queryParamMap.subscribe(queryParams => {
                  if (this.localStorageService.getUser()?.payload.role === Roles.STARTUP) {
                      this.receiverId = parseInt(queryParams.get('investorId')!);
                  }
                  else if (this.localStorageService.getUser()?.payload.role === Roles.INVESTOR) {
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
      }
      else if (this.localStorageService.getUser()?.payload.role === Roles.INVESTOR) {
        return this.chat.startup.title;
      }
    }
    return "new chat"
  }

  sendMessage(message: string) {
    if (this.chat) {
      this.socket.emit('message', {
        chatId: this.chat!.id,
        text: message,
      } as CreateMessageDto);
    }
    else {
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

    private scrollChatToBottom() {
        this.messagesContainer!.nativeElement.scrollTop = this.messagesContainer!.nativeElement.scrollHeight;
    }
}
