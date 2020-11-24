import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Role } from './_interfaces/role.interface';

@Injectable()
export class RoleService {

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) {
  }

  get(id: string): Observable<Role | undefined> {
    return !!!id ? this.initNewRole() : this.loadRole(id);
  }

  private initNewRole(): Observable<Role> {
    return of({ isCoreRole: false, assignedPermissionIds: [], title: '' });
  }

  loadRole(id: string): Observable<Role | undefined> {
    return this.firestoreService.doc<Role>(`roles/${id}`).valueChanges();
  }

  getFormFields(): FormGroup {
    return this.fb.group({
      id: null,
      title: [null, [Validators.required]],
      isCoreRole: false,
      assignedUserIds: [],
      assignedPermissions: []
    });
  }


  public save(role: Role): Promise<string> {
    return this.firestoreService.save(role, 'roles', 'role');
  }

  deleteRole(role: Role): Promise<void> {
    return this.firestoreService.delete<Role>(`roles/${role.id}`);
  }

  getRoleList(): Observable<Role[]> {
    return this.firestoreService.col<Role>(`roles`).valueChanges();
  }

}
