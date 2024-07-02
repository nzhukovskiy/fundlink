import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageService} from "../services/local-storage.service";

export const authGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  let user = localStorageService.getUser();
  let token = localStorageService.getToken();
  if (user && token) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
