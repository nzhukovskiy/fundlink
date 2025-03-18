import {CanActivateFn, Router} from '@angular/router';
import {Roles} from "../constants/roles";
import {inject} from "@angular/core";
import {LocalStorageService} from "../services/local-storage.service";

export function rolesGuard(role: Roles): CanActivateFn {
    return () => {
      const localStorageService = inject(LocalStorageService);
      const router = inject(Router);

      let user = localStorageService.getUser();
      if (user?.role === role) {
        return true;
      }
      return router.navigate(['**'], {skipLocationChange: true});
    };
}
