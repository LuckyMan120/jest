import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class Step1Guard implements CanActivate {

  constructor(
    private router: Router,
    private afs: AngularFirestore
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.afs.doc(`config/1`).valueChanges().pipe(
      take(1),
      map((cfg) => {
        if (cfg) {
          this.router.navigate(['/setup/step-2']);
          return false;
        }
        return true;
      })
    );
  }

}
