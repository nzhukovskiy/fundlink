import { Injectable } from '@angular/core';
import {AppHttpService} from "./app-http.service";
import {MainStatsDto} from "../data/dtos/responses/main-stats.dto";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

    constructor(private readonly appHttpService: AppHttpService) {
    }

    getMainStats() {
        return this.appHttpService.get<MainStatsDto>(`statistics/main-stats`)
    }
}
