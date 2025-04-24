import {Injectable, Injector} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {LocalStorageService} from "../services/local-storage.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private readonly localStorageService: LocalStorageService,
                private readonly toastrService: ToastrService,
                private readonly injector: Injector) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        let authReq = request.clone();
        const token = this.localStorageService.getToken();
        if (token) {
            authReq = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
        }
        return next.handle(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
                if (!authReq.url.includes('chatBetweenUsers') && !authReq.url.includes('recommendations')) {
                    const errorData = err.error?.data || {};
                    if (err.error?.message.length > 0) {
                        console.log('hghf')
                    }
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
}
