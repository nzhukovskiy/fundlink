import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Startup } from '../data/models/startup';
import { Investor } from '../data/models/investor';
import { HttpParams } from '@angular/common/http';
import { PaginationResult } from '../data/dtos/pagination-result';
import { UpdateStartupDto } from '../data/dtos/update-startup-dto';
import { FundingRound } from '../data/models/funding-round';
import { ExitStartupDto } from '../data/dtos/exit-startup.dto';

@Injectable({
    providedIn: 'root',
})
export class StartupService {

    constructor(private readonly appHttpService: AppHttpService) {
    }

    getAll(page?: number, itemsPerPage?: number, searchPattern?: string, tag?: string, isInteresting?: boolean, onlyActive?: boolean, includeExited?: boolean) {
        let query = new HttpParams();
        if (typeof searchPattern !== 'undefined') {
            query = query.append('title', searchPattern);
        }
        if (typeof tag !== 'undefined') {
            query = query.append('tag', tag);
        }
        if (typeof isInteresting !== 'undefined') {
            query = query.append('isInteresting', isInteresting);
        }
        if (typeof onlyActive !== 'undefined') {
            query = query.append('onlyActive', onlyActive);
        }
        if (typeof includeExited !== 'undefined') {
            query = query.append('includeExited', includeExited);
        }
        if (typeof page !== 'undefined') {
            query = query.append('page', page);
        }
        if (typeof itemsPerPage !== 'undefined') {
            query = query.append('limit', itemsPerPage);
        }
        return this.appHttpService.get<PaginationResult<Startup>>('startups', query);
    }

    getOne(id: number) {
        return this.appHttpService.get<Startup>(`startups/${id}`);
    }

    getInvestors(id: number, fundingRoundId?: string) {
        let params = new HttpParams();
        if (fundingRoundId !== undefined) {
            params = params.append('fundingRoundId', fundingRoundId);
        }
        return this.appHttpService.get<{investors: Investor[], startup: {id: number, preMoney: string}}>(`startups/${id}/investors`, params);
    }

    getCurrentStartup() {
        return this.appHttpService.get<Startup>(`startups/current-startup`);
    }

    update(updateStartupDto: UpdateStartupDto) {
        return this.appHttpService.patch<Startup>(`startups/`, updateStartupDto);
    }

    uploadStartupPresentation(presentation: File) {
        const formData = new FormData();
        formData.append('presentation', presentation);
        return this.appHttpService.post<Startup>(`startups/upload-presentation`, formData);
    }

    getCurrentFundingRound(startupId: number) {
        return this.appHttpService.get<FundingRound>(`startups/${startupId}/current-funding-round`);
    }

    addTag(tagId: number) {
        return this.appHttpService.post<Startup>(`startups/assign-tag`, { tagId });
    }

    removeTag(tagId: number) {
        return this.appHttpService.post<Startup>(`startups/remove-tag`, { tagId });
    }

    uploadStartupImage(image: File | null | undefined) {
        const formData = new FormData();
        if (image) {
            formData.append('logo', image);
        }
        return this.appHttpService.post<Startup>(`startups/upload-logo`, formData);
    }

    markStartupAsInteresting(startupId: number) {
        return this.appHttpService.post<Startup>(`startups/${startupId}/mark-as-interesting`, {});
    }

    removeStartupFromInteresting(startupId: number) {
        return this.appHttpService.post<Startup>(`startups/${startupId}/remove-from-interesting`, {});
    }

    getMostPopular() {
        return this.appHttpService.get<Startup[]>(`startups/most-popular`);
    }

    getMostFunded() {
        return this.appHttpService.get<Startup[]>(`startups/most-funded`);
    }

    exitStartup(exitStartupDto: ExitStartupDto) {
        return this.appHttpService.post<Startup>(`startups/exit`, exitStartupDto);
    }
}
