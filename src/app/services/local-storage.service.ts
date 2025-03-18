import { Injectable } from '@angular/core';
import {UserJwtInfo} from "../data/models/user-jwt-info";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setUser(userJwtInfo: UserJwtInfo, token: string) {
    localStorage.setItem("user", JSON.stringify(userJwtInfo));
    localStorage.setItem("token", token);
  }

  getUser() {
    let userInfo = localStorage.getItem("user");
    if (userInfo) {
      return JSON.parse(userInfo) as UserJwtInfo;
    }
    return undefined;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  removeUser() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}
