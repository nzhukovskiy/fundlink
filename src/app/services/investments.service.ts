import { Injectable } from '@angular/core';
import {AppHttpService} from "./app-http.service";
import {CreateInvestmentComponent} from "../components/dialogs/create-investment/create-investment.component";
import {CreateInvestmentDto} from "../data/dtos/create-investment.dto";
import {Investment} from "../data/models/investment";

@Injectable({
  providedIn: 'root'
})
export class InvestmentsService {

  constructor(private readonly appHttpService: AppHttpService) { }

  create(fundingRoundId: number, createInvestmentDto: CreateInvestmentDto) {
    return this.appHttpService.post<Investment>(`funding_rounds/${fundingRoundId}/investments`, createInvestmentDto);
  }
}
