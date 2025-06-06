import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RemoteFileService {

  constructor(private readonly httpClient: HttpClient) { }

  getImage(remotePath: string) {
    return this.httpClient.get(remotePath, {responseType: "blob"})
  }
}
