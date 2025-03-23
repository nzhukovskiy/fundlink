import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../local-storage.service';
import { User } from '../../data/models/user';
import { BehaviorSubject } from 'rxjs';
import { UserJwtInfo } from '../../data/models/user-jwt-info';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(private readonly localStorageService: LocalStorageService) {
        this.loadCurrentUser();
    }

    private currentUserSubject = new BehaviorSubject<UserJwtInfo | undefined>(undefined);
    currentUser$ = this.currentUserSubject.asObservable();

    private loadCurrentUser() {
        this.currentUserSubject.next(this.localStorageService.getUser());
    }

    clearUser() {
        this.currentUserSubject.next(undefined);
        this.localStorageService.removeUser();
    }

    setUser(user: UserJwtInfo, token: string) {
        this.localStorageService.setUser(user, token);
        this.currentUserSubject.next(user);
    }
}
