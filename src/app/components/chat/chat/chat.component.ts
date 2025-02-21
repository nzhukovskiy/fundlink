import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import {ActivatedRoute} from "@angular/router";
import {Chat} from "../../../data/models/chat";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(private chatService: ChatService,
              private readonly route: ActivatedRoute) { }

  chat?: Chat;
  receiverId?: number;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let chatId = params.get("id");
      console.log(chatId);
      if (chatId) {
        this.chatService.getChat(parseInt(chatId)).subscribe(res => {
          this.chat = res;
        })
      }
      else {
        this.route.queryParamMap.subscribe(queryParams => {
          const receiverId = queryParams.get('receiverId');
          if (receiverId) {
            this.receiverId = parseInt(receiverId);
          }
        });
      }
    })
  }

}
