import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Investor } from '../data/models/investor';
import { Investment } from '../data/models/investment';
import { UpdateInvestorDto } from '../data/dtos/update-investor.dto';
import { Startup } from '../data/models/startup';
import { StartupFullDto } from '../data/dtos/responses/startup-full.dto';
import {InvestorStatsDto} from "../data/dtos/responses/investor-stats.dto";
import {forkJoin} from "rxjs";
import {InvestmentFullDto} from "../data/dtos/responses/investment-full.dto";

@Injectable({
    providedIn: 'root',
})
export class InvestorsService {

    constructor(private readonly appHttpService: AppHttpService) {
    }

    getAll() {
        return this.appHttpService.get<{ data: Investor[] }>('investors');
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
