import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable()
export class Step2Guard implements CanActivate {

  constructor(
    private router: Router,
    private afs: AngularFirestore
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.afs.doc(`config/1`).valueChanges().pipe(
      take(1),
      map((cfg) => {
        if (!cfg) {
          this.router.navigate(['/setup/step-1']);
        }
        return true;
      }),
      switchMap(() => {
        return this.afs.doc(`applications/currentApplication`).valueChanges().pipe(
          take(1),
          map((app) => {
            if (app) {
              this.router.navigate(['/auth']);
              return false;
            }
            return true;
          }),
        );
      })
    );

  }

}
