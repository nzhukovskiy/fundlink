import { Injectable } from '@angular/core';
import {AppHttpService} from "./app-http.service";
import {Chat} from "../data/models/chat";
import {GetChatDTO} from "../data/dtos/get-chat.dto";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private readonly appHttpService: AppHttpService) { }

  getChat(id: number) {
    return this.appHttpService.get<Chat>(`chats/${id}`);
  }

  getChatBetweenUsers(getChatDTO: GetChatDTO) {
    return this.appHttpService.get<Chat>(`chats/chatBetweenUsers`, new HttpParams().set("startupId", getChatDTO.startupId).set("investorId", getChatDTO.investorId));
  }
}
