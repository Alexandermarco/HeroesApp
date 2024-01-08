import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { 
  ActivatedRouteSnapshot, 
  CanActivateFn, 
  CanMatchFn, 
  Route, 
  Router, 
  RouterStateSnapshot, 
  UrlSegment } from '@angular/router';
import { tap } from 'rxjs';

export const canActivateGuard: CanActivateFn = (
  route:ActivatedRouteSnapshot, 
  state:RouterStateSnapshot) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    return authService.checkAutentication()
      .pipe(
        tap( isAuthenticated => {
          if (!isAuthenticated) {
            router.navigate(['/auth/login'])
          }
        }),
        
      )

};

export const canMatchGuard: CanMatchFn = (route: Route, state:UrlSegment[]) => {
  console.log('CanMatch')
  console.log({ route, state })
  return false;
}
