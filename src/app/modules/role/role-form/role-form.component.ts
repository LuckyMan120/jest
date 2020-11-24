import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { RoleService } from '../role.service';
import { Permission } from './../../permission/_interfaces/permission.interface';
import { User } from './../../user/_interfaces/user.interface';
import { Role } from './../_interfaces/role.interface';

@Component({

  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  @ViewChildren(MatSelect) matSelects!: QueryList<MatSelect>;

  role$!: Observable<Role | undefined>;
  users$!: Observable<User[]>;
  permissions$!: Observable<Permission[]>;
  loading$!: Observable<boolean>;

  hasFormErrors = false;
  savedRole!: Role;
  form!: FormGroup;
  selectedUsers$!: Observable<User[]>;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService
  ) {
  }

  ngOnInit() {
    this.form = this.roleService.getFormFields();

    this.role$ = this.route.params.pipe(
      switchMap((params) => this.roleService.get(params.roleId)),
      map((role: Role | undefined) => {
        if (role) {
          this.form.patchValue(role);
          this.savedRole = Object.freeze(Object.assign({}, role));
          if (role.id) {
            this.form.get('isCoreRole')?.disable();
            this.form.get('title')?.disable();
          }
        }
        return role;
      })
    );
    this.users$ = this.firestoreService.col$<User>('users');
    this.permissions$ = this.firestoreService.col$<Permission>('permissions');
  }

  reset() {
    this.form.patchValue(this.savedRole);
  }

  onSubmit(withBack: boolean = false) {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.roleService.save(this.form.getRawValue() as Role).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  toggleAllSelection($event: MatCheckboxChange, i: number) {
    this.matSelects.forEach((matSelect: MatSelect, idx: number) => {
      if (i === idx) {
        matSelect.options.forEach((item: MatOption) => $event.checked ? item.select() : item.deselect());
        matSelect.close();
      }
    });
  }

  cancel() {
    return this.redirectToList();
  }

  redirectToList() {
    return this.router.navigate(['/roles/list']);
  }

  onAlertClose(): void {
    this.hasFormErrors = false;
  }

  deleteRole(item: Role) {
    this.firestoreService.removeItem('roles', item, 'role', '/roles/list');
  }

  setPermission($event: any) {
    console.log($event);
  }

  isAssignedPermission(role: Role, permission: Permission) {
    return role.assignedPermissionIds.find(id => id === permission.id);
  }

}
