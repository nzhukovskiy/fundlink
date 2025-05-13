import {Injectable, Injector} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, finalize, Observable, switchAll, switchMap, take, throwError} from 'rxjs';
import {LocalStorageService} from "../services/local-storage.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../services/auth.service";
import {User} from "../data/models/user";
import {UserService} from "../services/users/user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private readonly localStorageService: LocalStorageService,
                private readonly authService: AuthService,
                private readonly userService: UserService,
                private readonly toastrService: ToastrService,
                private readonly injector: Injector) {
    }

    refreshInProgress = new BehaviorSubject<boolean>(false)
    refreshToken = new BehaviorSubject("")

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        let authReq = request.clone();
        const token = this.localStorageService.getToken();
        if (token) {
            authReq = request.clone({setHeaders: {Authorization: `Bearer ${token.accessToken}`}});
        }
        return next.handle(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401 && !authReq.url.includes('refresh')) {
                    console.log("trying to refresh token")
                    return this.refreshTokens(authReq, next)
                }
                if (!authReq.url.includes('chatBetweenUsers') && !authReq.url.includes('recommendations')) {
                    const errorData = err.error?.data || {};
                    if (err.error?.message.length > 0) {
                        console.log('hghf')
                    }
                    console.log(err)
                    this.translate.get(`errors.${err.error.errorCode}`, errorData).subscribe(translated => {
                        this.toastrService.error(translated);
                    })
                }
                return throwError(() => err);
            })
        );
    }

    private _translateService?: TranslateService;

    private get translate(): TranslateService {
        if (!this._translateService) {
            this._translateService = this.injector.get(TranslateService);
        }
        return this._translateService;
    }

    private refreshTokens(request: HttpRequest<unknown>, next: HttpHandler) {
        if (!this.refreshInProgress.value) {
            this.refreshInProgress.next(true)
            return this.authService.refreshTokens().pipe(
                switchMap((tokens) => {
                    this.refreshToken.next(tokens.refreshToken)
                    return next.handle(this.addAuthHeaders(request))
                }),
                catchError((err) => {
                    this.userService.logout();
                    return throwError(() => err);
                }),
                finalize(() => {
                    this.refreshInProgress.next(false);
                })
            )
        }
        else {
            return this.refreshToken.pipe(
                filter(x => x !== ""),
                take(1),
                switchMap(x => {
                    return next.handle(this.addAuthHeaders(request))
                })
            )
        }
    }

    private addAuthHeaders(request: HttpRequest<unknown>) {
        const token = this.localStorageService.getToken();
        if (token) {
            return request.clone({setHeaders: {Authorization: `Bearer ${token.accessToken}`}});
        }
        return request
    }
}
