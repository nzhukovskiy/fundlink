import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppHttpService} from "./app-http.service";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private readonly appHttpService: AppHttpService) { }


}
