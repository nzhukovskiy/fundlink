import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Investor } from '../data/models/investor';

@Injectable({
  providedIn: 'root'
})
export class InvestorsService {

  constructor(private readonly appHttpService: AppHttpService) { }

    getAll() {
      return this.appHttpService.get<{data: Investor[]}>("investors");
    }

    getOne(id: number) {
      return this.appHttpService.get<Investor>(`investors/${id}`);
    }

    getCurrentInvestor() {
      return this.appHttpService.get<Investor>(`investors/current-investor`);
    }
}
