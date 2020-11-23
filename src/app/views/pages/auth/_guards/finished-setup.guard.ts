import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class FinishedSetupGuard implements CanActivate {

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.afs.doc(`applications/currentApplication`).valueChanges().pipe(
      take(1),
      map((app) => {
        if (!app) {
          this.router.navigate(['/setup']);
          return false;
        }
        return true;
      })
    );
  }

}
