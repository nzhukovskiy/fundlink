import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { LoginUserDto } from '../data/dtos/login-user.dto';
import { tap } from 'rxjs';
import { CreateStartupDto } from '../data/dtos/create-startup.dto';
import { CreateInvestorDto } from '../data/dtos/create-investor.dto';
import { jwtDecode } from 'jwt-decode';
import { instanceToPlain } from 'class-transformer';
import { UserJwtInfo } from '../data/models/user-jwt-info';
import { UserService } from './users/user.service';
import {Tokens} from "../data/dtos/tokens";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private readonly appHttpService: AppHttpService,
                private readonly userService: UserService,
                private readonly localStorageService: LocalStorageService) {
    }

    login(userLoginDto: LoginUserDto) {
        return this.appHttpService.post<Tokens>(`auth/login`, userLoginDto).pipe(
            this.setUser()
        );
    }

    registerStartup(createStartupDto: CreateStartupDto) {
        const payload = instanceToPlain(createStartupDto);
        return this.appHttpService.post<Tokens>(`startups`, payload).pipe(
            this.setUser()
        );
    }

    registerInvestor(createInvestorDto: CreateInvestorDto) {
        return this.appHttpService.post<Tokens>(`investors`, createInvestorDto).pipe(
            this.setUser()
        );
    }

    private setUser() {
        return tap<Tokens>(x => this.userService.setUser(
            jwtDecode<{ payload: UserJwtInfo }>(x.accessToken).payload, x),
        )
    }

    refreshTokens() {
        return this.appHttpService.post<Tokens>(`auth/refresh`, {
            refreshToken: this.localStorageService.getToken()?.refreshToken
        }).pipe(this.setUser())
    }
}
