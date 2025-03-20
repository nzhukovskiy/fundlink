import {Injectable} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {LocalStorageService} from "../local-storage.service";

@Injectable({
    providedIn: 'root'
})
export abstract class AppSocketService extends Socket {

    constructor(namespace: string, protected readonly localStorageService: LocalStorageService) {
        super({
            url: `http://localhost:3001/${namespace}`,
            options: {
                auth: {
                    token: localStorageService.getToken() || '',
                },
            },
        });
    }

}
