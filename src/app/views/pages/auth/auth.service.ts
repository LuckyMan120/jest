import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Permission } from '../../../modules/permission/_interfaces/permission.interface';
import { User } from '../../../modules/user/_interfaces/user.interface';
import { Role } from './../../../modules/role/_interfaces/role.interface';
import { GravatarService } from './gravatar.service';
import { AuthRegisterUser } from './_interfaces/auth-register-user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUser$: Observable<any>;
  authUserId!: string;
  authUserName!: string;
  authUser!: User;

  constructor(
    private afAuth: AngularFireAuth,
    private gravatarService: GravatarService,
    private afs: AngularFirestore
  ) {
    this.authUser$ = this.afAuth.authState.pipe(
      map((user: firebase.User | null) => {
        if (user) {
          this.authUserId = user.uid;
          this.authUserName = user.displayName || 'ANONYMOUS';
          this.authUser = user as any;
        }
        return user;
      }),
      switchMap((user: firebase.User | null) => {
        return user ? this.afs.doc(`/users/${user.uid}`).valueChanges() : of(undefined);
      })
    );
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  async signIn(credentials: { email: string, password: string, rememberMe: boolean }): Promise<void> {
    const user = await this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
    return this.afs.doc(`users/${user.user?.uid}`).set({
      id: user.user?.uid,
      providerId: user.additionalUserInfo?.providerId,
      email: user.user?.email,
      emailVerified: user.user?.emailVerified,
      lastSignInTime: new Date().valueOf()
    }, { merge: true });
  }

  async register(values: AuthRegisterUser): Promise<{ success: boolean } | { error: any }> {
    const user = await this.afAuth.createUserWithEmailAndPassword(values.email, values.password as string);
    const p1 = this.createFirebaseUser({ ...user, ...values });
    const p2 = (await this.afAuth.currentUser)?.sendEmailVerification();
    await Promise.all([p1, p2]);
    return { success: true };
  }

  async sendVerificationMail(): Promise<void | undefined> {
    return (await this.afAuth.currentUser)?.sendEmailVerification();
  }

  requestPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  async doFacebookLogin(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('manage_pages');
    provider.addScope('publish_pages');

    const user = await this.afAuth.signInWithPopup(provider);
    return this.createFirebaseUser(user);
  }

  async doTwitterLogin(): Promise<void> {
    const user = await this.afAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    return this.createFirebaseUser(user);
  }

  async doGoogleLogin(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    const user = await this.afAuth.signInWithPopup(provider);
    return this.createFirebaseUser(user);
  }

  private createFirebaseUser(user: any): Promise<void> {
    return this.afs.doc(`users/${user.user?.uid}`).set({
      id: user.user?.uid,
      firstName: (user)?.firstName,
      lastName: (user)?.lastName,
      creationTime: new Date(user.user?.metadata.creationTime).valueOf(),
      lastSignInTime: new Date(user.user?.metadata.lastSignInTime).valueOf(),
      displayName: user.user?.displayName || user?.displayName || '',
      password: user.password,
      photoUrl: user.user?.photoURL ? user.user?.photoURL : this.gravatarService.getUserGravatar(user.user?.email || user?.email),
      phoneNumber: user.user?.phoneNumber,
      providerId: user.user?.providerId,
      email: user.user?.email,
      emailVerified: user.user?.emailVerified
    }, { merge: true });
  }


  public checkPermissions(user: User, roles: Role[] | undefined, permissions: Permission[], reqPermissions: string[]): boolean {
    if (!user || !user.assignedRoles || !roles) {
      return false;
    }

    const dbPermissions = reqPermissions.map(reqPermission =>
      permissions.find(permission => permission.title?.toLocaleLowerCase() === reqPermission)
    );

    const dbRoles = Object.keys(user.assignedRoles).map(role => roles.find(singleRole => singleRole.title === role));

    if (!dbRoles || dbPermissions.length === 0) {
      return false;
    }

    return dbRoles.some((role) => dbPermissions.find((perm) => perm && role && role.assignedPermissionIds.includes(perm.id as string)));
  }

}
