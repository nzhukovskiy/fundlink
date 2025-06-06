import { Injectable } from '@angular/core';
import { UserJwtInfo } from '../data/models/user-jwt-info';
import {Tokens} from "../data/dtos/tokens";

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {

    constructor() {
    }

    setUser(userJwtInfo: UserJwtInfo, tokens: Tokens) {
        localStorage.setItem('user', JSON.stringify(userJwtInfo));
        localStorage.setItem('token', JSON.stringify(tokens));
    }

    getUser() {
        return this.getStorageJson<UserJwtInfo>('user')
    }

    getToken() {
        return this.getStorageJson<Tokens>('token')
    }

    removeUser() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    private getStorageJson<T>(itemKey: string) {
        const item = localStorage.getItem(itemKey);
        if (item) {
            return JSON.parse(item) as T;
        }
        return undefined;
    }
}
