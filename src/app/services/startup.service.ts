import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Startup } from '../data/models/startup';
import { Investor } from '../data/models/investor';
import {HttpParams} from "@angular/common/http";
import {PaginationResult} from "../data/dtos/pagination-result";
import {UpdateStartupDto} from "../data/dtos/update-startup-dto";
import { FundingRound } from '../data/models/funding-round';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  constructor(private readonly appHttpService: AppHttpService) { }

    getAll(page?: number, per_page?: number) {
      let query = new HttpParams();
      if (typeof page !== "undefined") {
        query = query.append("page", page);
      }
      if (typeof per_page !== "undefined") {
        query = query.append("limit", per_page);
      }
      return this.appHttpService.get<PaginationResult<Startup>>("startups", query);
    }

    getOne(id: number) {
      return this.appHttpService.get<Startup>(`startups/${id}`);
    }

    getInvestors(id: number) {
      return this.appHttpService.get<Investor[]>(`startups/${id}/investors`);
    }

    getCurrentStartup() {
      return this.appHttpService.get<Startup>(`startups/current-startup`);
    }

    update(updateStartupDto: UpdateStartupDto) {
      return this.appHttpService.patch<Startup>(`startups/`, updateStartupDto);
    }

    uploadStartupPresentation(presentation: File) {
      const formData = new FormData();
      formData.append("presentation", presentation);
      return this.appHttpService.post<Startup>(`startups/upload-presentation`, formData);
    }

    getCurrentFundingRound(startupId: number) {
      return this.appHttpService.get<FundingRound>(`startups/${startupId}/current-funding-round`);
    }
}
