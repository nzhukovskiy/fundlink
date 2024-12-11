import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Investor } from '../data/models/investor';
import {Investment} from "../data/models/investment";
import { UpdateInvestorDto } from '../data/dtos/update-investor.dto';

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
      return this.appHttpService.get<Investor>(`investors/current_investor`);
    }

    getFullInvestmentsInfo() {
      return this.appHttpService.get<Investment[]>(`investors/investments`);
    }

    update(updateInvestorDto: UpdateInvestorDto) {
      return this.appHttpService.put<Investor>(`investors/`, updateInvestorDto);
    }

    getRecommendations() {
      return this.appHttpService.get(`investors/recommendations`);
    }
}
