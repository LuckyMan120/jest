import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Permission } from './../../modules/permission/_interfaces/permission.interface';
import { Role } from './../../modules/role/_interfaces/role.interface';
import { User } from './../../modules/user/_interfaces/user.interface';
import { AuthService } from './../../views/pages/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private afs: AngularFirestore
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((user: any) => {
        if (!user) {
          this.router.navigate(['/auth/login']);
        }
        if (!user.emailVerified) {
          this.router.navigate(['/auth/verify-email']);
        }

        return forkJoin([
          this.afs.collection<Role>(`roles`).get(),
          this.afs.collection<Permission>(`permissions`).get(),
          this.afs.doc<User>(`users/${user.uid}`).get()
        ]);
      }),
      map((result) => {

        if (!result) {
          return false;
        }
        console.log('Permission required: ' + route.data.permissions);

        const user = result[2].data() as User;
        if (!this.authService.checkPermissions(user,
          result[0].docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as Role),
          result[1].docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as Permission),
          route.data.permissions)) {
          if (route.data.permissions.includes('adminzugang')) {
            this.router.navigate(['/auth/forbidden']);
          } else {
            this.router.navigate(['/forbidden']);
          }
          return false;
        }

        return true;
      })
    );
  }

}
