import {ResolveFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {StartupService} from "../services/startup.service";
import {catchError, EMPTY} from "rxjs";
import {Investor} from "../data/models/investor";
import {InvestorsService} from "../services/investors.service";

export const investorResolver: ResolveFn<Investor> = (route, state) => {
  const investorsService = inject(InvestorsService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  return investorsService.getOne(parseInt(id!)).pipe(
    catchError(() => {
      router.navigate(['**'], {skipLocationChange: true}).then();
      return EMPTY;
    })
  );
};
