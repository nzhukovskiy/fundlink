import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AppSocketService extends Socket {

  constructor(private readonly localStorageService: LocalStorageService) {
    super({
      url: 'http://localhost:3001',
      options: {
        auth: {
          token: localStorageService.getToken() || '',
        },
      },
    });
  }
}
