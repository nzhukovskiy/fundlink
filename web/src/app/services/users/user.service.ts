import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { UserJwtInfo } from '../../data/models/user-jwt-info';
import { Tokens } from '../../data/dtos/tokens';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(private readonly localStorageService: LocalStorageService,
                private readonly router: Router) {
        this.loadCurrentUser();
    }

    private currentUserSubject = new BehaviorSubject<UserJwtInfo | undefined>(undefined);
    currentUser$ = this.currentUserSubject.asObservable();

    private loadCurrentUser() {
        this.currentUserSubject.next(this.localStorageService.getUser());
    }

    logout() {
        this.clearUser();
        this.router.navigate(['/login']).then();
    }

    clearUser() {
        this.currentUserSubject.next(undefined);
        this.localStorageService.removeUser();
    }

    setUser(user: UserJwtInfo, tokens: Tokens) {
        this.localStorageService.setUser(user, tokens);
        this.currentUserSubject.next(user);
    }
}
