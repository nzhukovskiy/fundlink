import {ResolveFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ChatService} from "../services/chat.service";
import {catchError, EMPTY} from "rxjs";
import {Startup} from "../data/models/startup";
import {StartupService} from "../services/startup.service";

export const startupResolver: ResolveFn<Startup> = (route, state) => {
  const startupService = inject(StartupService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  return startupService.getOne(parseInt(id!)).pipe(
    catchError(() => {
      router.navigate(['**'], {skipLocationChange: true}).then();
      return EMPTY;
    })
  );
};
