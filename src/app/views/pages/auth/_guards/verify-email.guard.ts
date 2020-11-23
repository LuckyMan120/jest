import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class VerifyEmailGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.authUser$.pipe(
      map((user) => {
        // redirect to login OR dashboard if user is (not) logged in
        if (!user || (user && user.providerId === 'password' && user.emailVerified)) {
          this.router.navigate(['/']);
        }
        return true;
      })
    );
  }

}
