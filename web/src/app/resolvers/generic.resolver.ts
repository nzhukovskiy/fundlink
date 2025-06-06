import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { inject } from '@angular/core';

export function genericResolver<T, S>(
    serviceToken: { new(...args: any[]): S },
    serviceMethod: (service: S, id: number) => Observable<T>
): ResolveFn<T> {
    return (route, state): Observable<T> => {
        const router = inject(Router);
        const service = inject(serviceToken);
        const id = route.paramMap.get('id');
        return serviceMethod(service, parseInt(id!, 10)).pipe(
            catchError(() => {
                router.navigate(['**'], { skipLocationChange: true }).then();
                return EMPTY;
            })
        );
    };
}
