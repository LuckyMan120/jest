import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Permission } from './_interfaces/permission.interface';

@Injectable()
export class PermissionService {

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) {
  }

  getPermissionList(): Observable<Permission[]> {
    return this.firestoreService.col<Permission>(`permissions`).valueChanges();
  }

  get(id: string): Observable<Permission | undefined> {
    return !!!id ? this.initNewPermission() : this.loadPermission(id);
  }

  initNewPermission(): Observable<Permission> {
    return of({ title: '', isCorePermission: false });
  }

  loadPermission(id: string): Observable<Permission | undefined> {
    return this.firestoreService.doc<Permission>(`permissions/${id}`).valueChanges();
  }

  getFormFields(): FormGroup {
    return this.fb.group({
      id: null,
      title: '',
      isCorePermission: [false]
    });
  }

  async save(permission: Permission) {
    permission.id = permission.title?.toLowerCase().replace(/[^a-zA-Z]/g, '');
    return this.firestoreService.save(permission, 'permissions', 'permission');
  }

}
