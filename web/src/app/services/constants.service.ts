import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor(private readonly appHttpService: AppHttpService) { }


  getIndustryTypes() {
    return this.appHttpService.get<string[]>("industry_types");
  }
}
