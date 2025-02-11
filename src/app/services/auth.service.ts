import { Injectable } from '@angular/core';
import {AppHttpService} from "./app-http.service";
import {LoginUserDto} from "../data/dtos/login-user.dto";
import {tap} from "rxjs";
import {CreateStartupDto} from "../data/dtos/create-startup.dto";
import {LocalStorageService} from "./local-storage.service";
import {CreateInvestorDto} from "../data/dtos/create-investor.dto";
import {jwtDecode} from "jwt-decode";
import { instanceToPlain } from 'class-transformer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly appHttpService: AppHttpService,
              private readonly localStorageService: LocalStorageService) { }

  login(userLoginDto: LoginUserDto) {
    return this.appHttpService.post<{accessToken: {access_token: string}}>(`auth/login`, userLoginDto).pipe(
      tap(x => this.localStorageService.setUser(
        jwtDecode(x.accessToken.access_token), x.accessToken.access_token)
      )
    )
  }

  registerStartup(createStartupDto: CreateStartupDto) {
    const payload = instanceToPlain(createStartupDto);
    return this.appHttpService.post<{access_token: string}>(`startups`, payload).pipe(
      tap(x => this.localStorageService.setUser(
        jwtDecode(x.access_token), x.access_token)
      )
    )
  }

  registerInvestor(createInvestorDto: CreateInvestorDto) {
    return this.appHttpService.post<{access_token: string}>(`investors`, createInvestorDto).pipe(
      tap(x => this.localStorageService.setUser(
        jwtDecode(x.access_token), x.access_token)
      )
    )
  }
}
