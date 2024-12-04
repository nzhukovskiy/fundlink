import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppHttpService {
    private readonly baseUrl = "http://localhost:5000/";
    constructor(private readonly httpClient: HttpClient) { }

    post<T>(action: string, body: {}|null) {
        return this.httpClient.post<T>(`${this.baseUrl}${action}`, body);
    }

    get<T>(action: string, query: HttpParams|undefined = undefined) {
        return this.httpClient.get<T>(`${this.baseUrl}${action}`, {params: query});
    }

    put<T>(action: string, body: {}|null, options?: {}) {
        return this.httpClient.put<T>(`${this.baseUrl}${action}`, body, options);
    }

    patch<T>(action: string, body: {}|null, options?: {}) {
      return this.httpClient.patch<T>(`${this.baseUrl}${action}`, body, options);
    }

    delete<T>(action: string, body: {}|null = null) {
        return this.httpClient.delete<T>(`${this.baseUrl}${action}`, {body: body});
    }
}
