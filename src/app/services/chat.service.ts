import { Injectable } from '@angular/core';
import {AppHttpService} from "./app-http.service";
import {Chat} from "../data/models/chat";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private readonly appHttpService: AppHttpService) { }

  getChat(id: number) {
    return this.appHttpService.get<Chat>(`chats/${id}`);
  }
}
