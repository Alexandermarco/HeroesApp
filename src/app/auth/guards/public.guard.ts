import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

export const canActivatePublicGuard: CanActivateFn = (
  route:ActivatedRouteSnapshot, 
  state:RouterStateSnapshot) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    return authService.checkAutentication()
      .pipe(
        tap( isAuthenticated => console.log('Autenticacion: ', isAuthenticated) ),
        tap( isAuthenticated => {
          if (isAuthenticated) {
            router.navigate(['/'])
          }
        }),
        map( isAuthenticated => !isAuthenticated )
      )
};
