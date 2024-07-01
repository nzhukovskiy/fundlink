import { Injectable } from '@angular/core';
import {UserJwtInfo} from "../data/models/user-jwt-info";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setUser(userJwtInfo: UserJwtInfo) {
    localStorage.setItem("user", JSON.stringify(userJwtInfo));
  }

  getUser() {
    let userInfo = localStorage.getItem("user");
    if (userInfo) {
      return JSON.parse(userInfo) as UserJwtInfo;
    }
    return null;
  }

  removeUser() {
    localStorage.removeItem("user");
  }
}
