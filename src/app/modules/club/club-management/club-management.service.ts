import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { ClubManagement } from '../_interfaces/club-management.interface';

@Injectable({
  providedIn: 'root'
})
export class ClubManagementService {

  private collectionTitle = 'club-management';

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) { }

  public async save(item: ClubManagement): Promise<string> {
    item.startDate = item.startDate.valueOf();
    item.endDate = item.endDate ? item.endDate.valueOf() : null;
    item.title = `Neues Vorstandsmitglied`;
    return this.firestoreService.save(item, 'club-management');
  }

  public getFormFields(): FormGroup {
    return this.fb.group({
      id: null,
      assignedMemberId: [null, [Validators.required]],
      assignedCategoryId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: null
    });
  }

  public get(id: string): Observable<ClubManagement> {
    if (!!!id) {
      return this.initNewManagementPosition();
    } else {
      return this.loadManagementPosition(id);
    }
  }

  private initNewManagementPosition(): Observable<ClubManagement> {
    return of({
      assignedMemberId: '',
      assignedCategoryId: '',
      startDate: new Date() as any,
      endDate: null,
      galleries: null
    });
  }

  private loadManagementPosition(id: string): Observable<ClubManagement> {
    return this.firestoreService.doc$<ClubManagement>(`${this.collectionTitle}/${id}`).pipe(
      map((management) => {
        return {
          ...management,
          startDate: new Date(management.startDate) as any,
          endDate: management.endDate ? new Date(management.endDate) as any : null,
        };
      })
    );
  }

}
