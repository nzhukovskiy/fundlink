import {ResolveFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageService} from "../services/local-storage.service";
import {ChatService} from "../services/chat.service";
import {catchError, EMPTY} from "rxjs";
import {Chat} from "../data/models/chat";

export const chatResolver: ResolveFn<Chat> = (route, state) => {
  const chatService = inject(ChatService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  return chatService.getChat(parseInt(id!)).pipe(
    catchError(error => {
      router.navigate(['**'], {skipLocationChange: true}).then();
      return EMPTY;
    })
  );
};
