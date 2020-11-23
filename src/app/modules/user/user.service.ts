import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../../shared/services/firestore.service';
import { User } from './_interfaces/user.interface';

@Injectable()
export class UserService {

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) {
  }

  get(id: string): Observable<User | undefined> {
    return this.firestoreService.doc<User>(`users/${id}`).valueChanges().pipe(
      map((user: User | undefined) => {
        if (user) {
          return {
            ...user,
            displayName: this.firestoreService.getUserTitle(user || null),
            assignedRoles: Object.keys(user.assignedRoles).filter(role => {
              return user.assignedRoles[role] === true;
            })
          };
        }
      })
    );
  }

  getFormFields(): FormGroup {
    return this.fb.group({
      id: null,
      assignedRoles: [[], [Validators.required]],
      creationTime: null,
      firstName: null,
      lastName: null,
      displayName: [null, [Validators.required]],
      email: null,
      disabled: null,
      emailVerified: false,
      lastSignInTime: null,
      phoneNumber: null,
      photoUrl: null,
      providerId: 'password',
      profileImage: null
    });
  }

  public async save(user: User): Promise<string> {
    if (user.assignedRoles) {
      user.assignedRoles = user.assignedRoles.reduce((acc: any, role: string) => {
        // console.log(role);
        return { ...acc, [role]: true };
      }, {});
    }
    console.log(user.assignedRoles);
    user.displayName = this.firestoreService.getUserTitle(user);
    return this.firestoreService.save(user, 'users', 'user');
  }

  deleteUser(user: User): Promise<void> {
    return this.firestoreService.delete<User>(`users/${user.id}`);
  }

  getUserList(): Observable<User[]> {
    return this.firestoreService.col$<User>(`users`).pipe(
      map((users: User[]) =>
        users.map((user) => {
          return {
            ...user,
            displayName: this.firestoreService.getUserTitle(user),
            assignedRoles: Object.keys(user.assignedRoles).filter(role => {
              return user.assignedRoles[role] === true;
            })
          };
        })
      )
    );
  }

}
