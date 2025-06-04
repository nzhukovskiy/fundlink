import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { CreateInvestmentDto } from '../data/dtos/create-investment.dto';
import { Investment } from '../data/models/investment';

@Injectable({
    providedIn: 'root'
})
export class InvestmentsService {

    constructor(private readonly appHttpService: AppHttpService) {
    }

    create(fundingRoundId: number, createInvestmentDto: CreateInvestmentDto) {
        return this.appHttpService.post<Investment>(`funding-rounds/${fundingRoundId}/investments`, createInvestmentDto);
    }

    approveInvestment(investmentId: number) {
        return this.appHttpService.post<Investment>(`investments/${investmentId}/approve`, {});
    }

    rejectInvestment(investmentId: number) {
        return this.appHttpService.post<Investment>(`investments/${investmentId}/reject`, {});
    }
}
