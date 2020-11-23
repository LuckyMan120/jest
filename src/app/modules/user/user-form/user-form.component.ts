import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../views/pages/auth/auth.service';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { Role } from './../../role/_interfaces/role.interface';
import { UserService } from './../user.service';
import { User } from './../_interfaces/user.interface';

@Component({

  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  user$!: Observable<User | undefined>;
  roles$!: Observable<Role[]>;

  loading$!: Observable<boolean>;
  hasFormErrors = false;

  savedUser!: User;
  showNotEditableMessage = false;
  form!: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.form = this.userService.getFormFields();

    this.user$ = this.route.params.pipe(
      switchMap(params => this.userService.get(params.userId)),
      tap((user: User | undefined) => {
        if (user) {
          this.form.patchValue(user);
          this.savedUser = Object.freeze(Object.assign({}, user));
          this.form.get('emailVerified')?.disable();
          // TODO
          /* if (user.providerId === 'password') {
            this.form.get('email')?.disable();
          } */
          if (user.id === this.authService.authUserId) {
            this.form.get('disabled')?.disable();
            this.showNotEditableMessage = true;
          }
        }
      })
    );

    this.roles$ = this.firestoreService.col$('roles');
  }

  reset() {
    this.form.patchValue(this.savedUser);
  }

  onSubmit(withBack: boolean = false) {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.userService.save(this.form.getRawValue() as User).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  cancel() {
    return this.redirectToList();
  }

  redirectToList() {
    return this.router.navigate(['/users/list']);
  }

  onAlertClose(): void {
    this.hasFormErrors = false;
  }

  deleteUser(user: User) {
    user.title = this.firestoreService.getUserTitle(user);
    this.firestoreService.removeItem('users', user, 'user', '/users/list');
  }

  updateControl(path: string, value: any) {
    const control = this.form.controls[path];
    control.setValue(value);
    control.markAsDirty();
  }

}
