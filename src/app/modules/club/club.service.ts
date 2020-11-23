import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from './../../views/pages/auth/auth.service';
import { Club } from './_interfaces/club.interface';

@Injectable()
export class ClubService {

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  public async save(club: Club): Promise<string | void> {
    let createWithGivenId = false;
    if (!club.id) {
      club.id = 'currentClub';
      createWithGivenId = true;
    }
    return this.firestoreService.save(club, 'clubs', 'club', false, true);
  }

  public getCurrentClub(): Observable<Club> {
    return this.firestoreService.doc$<Club>(`clubs/currentClub`).pipe(
      switchMap((club: Club) => !club
        ? this.initNewClub()
        : of({
          ...club,
          creation: this.firestoreService.getCreation(club),
          publication: this.firestoreService.getPublication(club),
          modification: this.firestoreService.getModification(club)
        }))
    );
  }

  public getFormFields(): FormGroup {
    return this.fb.group({
      id: null,
      fussballdeUrl: null,
      clubColours: null,
      founding: null,
      assignedLocationIds: [],
      address: this.fb.group({
        streetName: null,
        city: null,
        county: null,
        zip: null,
        state: null,
        houseNumber: null
      }),
      isImported: null,
      galleries: {
        Veranstaltungsflyer: {
          title: 'Veranstaltungsflyer'
        }
      },
      files: {
        'Anträge und Formulare': {
          title: 'Anträge und Formulare'
        }
      },
      logo: null,
      managementImage: null,
      managementImageDescription: null,
      creation: this.firestoreService.initCreationFormGroup(),
      publication: this.firestoreService.initPublicationFormGroup(),
      modification: this.firestoreService.initModificationFormArray(),
    });
  }

  private initNewClub(): Observable<Club> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          galleries: {
            Vereinswappen: {
              title: 'Vereinswappen'
            }
          },
          files: {
            'Anträge und Formulare': {
              title: 'Anträge und Formulare'
            }
          },
          founding: '',
          clubColours: '',
          fussballdeUrl: '',
          assignedLocationIds: [],
          address: {
            streetName: '',
            city: '',
            county: '',
            zip: '',
            state: '',
            houseNumber: ''
          },
          isImported: false,
          managementImageDescription: '',
          creation: this.firestoreService.getCreation({}, user),
          publication: this.firestoreService.getPublication({}, user),
          modification: this.firestoreService.getModification({}, { by: user, change: 'NEW' })
        };
      }
      )
    );
  }

}
