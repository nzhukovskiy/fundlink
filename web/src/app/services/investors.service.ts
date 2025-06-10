import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Investor } from '../data/models/investor';
import { UpdateInvestorDto } from '../data/dtos/update-investor.dto';
import { StartupFullDto } from '../data/dtos/responses/startup-full.dto';
import { InvestorStatsDto } from '../data/dtos/responses/investor-stats.dto';
import { forkJoin } from 'rxjs';
import { InvestmentFullDto } from '../data/dtos/responses/investment-full.dto';
import { HttpParams } from '@angular/common/http';
import { PaginationResult } from '../data/dtos/pagination-result';

@Injectable({
    providedIn: 'root',
})
export class InvestorsService {

    constructor(private readonly appHttpService: AppHttpService) {
    }

    getAll(page?: number, itemsPerPage?: number) {
        let query = new HttpParams();
        if (typeof page !== 'undefined') {
            query = query.append('page', page);
        }
        if (typeof itemsPerPage !== 'undefined') {
            query = query.append('limit', itemsPerPage);
        }
        return this.appHttpService.get<PaginationResult<Investor>>('investors', query);
    }

    getOne(id: number) {
        return this.appHttpService.get<Investor>(`investors/${id}`);
    }

    getCurrentInvestor() {
        return this.appHttpService.get<Investor>(`investors/current-investor`);
    }

    getFullInvestmentsInfo() {
        return this.appHttpService.get<InvestmentFullDto[]>(`investors/investments`);
    }

    update(updateInvestorDto: UpdateInvestorDto) {
        return this.appHttpService.patch<Investor>(`investors/`, updateInvestorDto);
    }

    getRecommendations() {
        return this.appHttpService.get(`investors/recommendations`);
    }

    getStartups(id: number) {
        return this.appHttpService.get<StartupFullDto[]>(`investors/${id}/startups`);
    }

    getInvestorStats(id: number) {
        return this.appHttpService.get<InvestorStatsDto>(`investors/${id}/stats`);
    }

    getInvestorAndStats(id: number) {
        return forkJoin({
            investor: this.getOne(id),
            stats: this.getInvestorStats(id)
        })
    }
}
