import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { ClubHonorary } from './../_interfaces/club-honorary.interface';

@Injectable({
  providedIn: 'root'
})
export class ClubHonorariesService {

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) { }

  public getHonoraryFormFields(): FormGroup {
    return this.fb.group({
      id: null,
      assignedMemberId: [null, [Validators.required]],
      assignedArticleId: [null],
      startDate: [null, [Validators.required]]
    });
  }

  public async saveHonorary(item: ClubHonorary): Promise<string> {
    if (item.startDate) { item.startDate = item.startDate.valueOf(); }
    item.title = `Ehrenmitglied speichern`;
    return this.firestoreService.save(item, 'club-honorary');
  }


  public getHonorary(id: string): Observable<ClubHonorary> {
    if (!!!id) {
      return this.initNewHonorary();
    } else {
      return this.loadHonorary(id);
    }
  }

  private initNewHonorary(): Observable<ClubHonorary> {
    return of({
      assignedMemberId: '',
      assignedArticleId: '',
      startDate: new Date()
    });
  }

  private loadHonorary(id: string): Observable<ClubHonorary> {
    return this.firestoreService.doc$<ClubHonorary>(`club-honorary/${id}`).pipe(
      map((honorary: ClubHonorary) => {
        return {
          ...honorary,
          startDate: new Date(honorary.startDate)
        };
      })
    );
  }

  getLatestHonoraries(count: number): Observable<ClubHonorary[]> {
    return this.firestoreService.col<ClubHonorary>(`club-honorary`, (ref: Query) => {
      ref = ref.orderBy('startDate', 'desc');
      ref = ref.limit(count);
      return ref;
    }).valueChanges().pipe(
      map(honoraries => {
        return honoraries.map((honorary) => {
          return {
            ...honorary,
            startDate: new Date(honorary.startDate)
          };
        });
      })
    );
  }

}
