import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class UnAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.authUser$.pipe(
      map((user) => {
        if (user && user.providerId === 'password' && !user.emailVerified) {
          this.router.navigate(['/auth/verify-email']);
        }
        if (user && (user.providerId !== 'password' || user.providerId === 'password' && user.emailVerified)) {
          this.router.navigate(['/start/dashboard']);
        }
        return true;
      })
    );
  }

}
