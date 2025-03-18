import { ResolveFn, Router } from '@angular/router';
import { FundingRound } from '../data/models/funding-round';
import { FundingRoundsService } from '../services/funding-rounds.service';
import { genericResolver } from './generic.resolver';
import { inject } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

export const fundingRoundResolver: ResolveFn<FundingRound> = (route, state) => {
    const fundingRoundsService = inject(FundingRoundsService);
    const localStorageService = inject(LocalStorageService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    return fundingRoundsService.getOne(parseInt(id!)).pipe(
        tap(fundingRound => {
            if (localStorageService.getUser()?.id !== fundingRound.startup.id) {
                router.navigate(['**'], {skipLocationChange: true}).then();
            }
        }),
        catchError(() => {
            router.navigate(['**'], {skipLocationChange: true}).then();
            return EMPTY;
        })
    );
};
