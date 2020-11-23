import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { PermissionService } from '../permission.service';
import { Permission } from '../_interfaces/permission.interface';

@Component({

  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {

  permission$!: Observable<Permission | undefined>;

  hasFormErrors = false;
  savedPermission!: Permission;
  form!: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit() {
    this.form = this.permissionService.getFormFields();

    this.permission$ = this.route.params.pipe(
      switchMap(params => this.permissionService.get(params.permissionId)),
      tap((permission: Permission | undefined) => {
        if (permission) {
          this.form.patchValue(permission);
          if (permission.isCorePermission) {
            this.form.get('title')?.disable();
            this.form.get('isCorePermission')?.disable();
          }
          this.savedPermission = Object.freeze(Object.assign({}, permission));
        }
      })
    );
  }

  reset() {
    this.form.patchValue(this.savedPermission);
  }

  onSubmit(withBack: boolean = false) {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.permissionService.save(this.form.getRawValue() as Permission).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  cancel() {
    return this.redirectToList();
  }

  redirectToList() {
    return this.router.navigate(['/permissions/list']);
  }

  onAlertClose(): void {
    this.hasFormErrors = false;
  }

  deletePermission(item: Permission) {
    this.firestoreService.removeItem('permissions', item, 'permission', '/permissions/list');
  }

}
