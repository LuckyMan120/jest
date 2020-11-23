import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from '../../views/pages/auth/auth.service';
import { ProfileService } from './../../shared/services/profile.service';
import { Member } from './../member/_interfaces/member.interface';
import { Player } from './../player/_interfaces/player.interface';
import { Senior } from './_interfaces/senior.interface';

@Injectable({
  providedIn: 'root'
})
export class SeniorService {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private profileService: ProfileService
  ) {
  }

  public get(id: string): Observable<Senior> {
    return !!!id ? this.initNewSenior() : this.loadSenior(id);
  }

  public save(senior: Senior): Promise<string> {
    if (senior.birthDate) { senior.birthDate = senior.birthDate.valueOf(); }
    if (senior.entryDate) { senior.entryDate = senior.entryDate.valueOf(); }
    if (senior.exitDate) { senior.exitDate = senior.exitDate.valueOf(); }
    return this.firestoreService.save(senior, 'seniors', 'senior');
  }

  public getSeniorFormFields(): FormGroup {
    return this.fb.group({
      entryDate: null,
      exitDate: null,
      fee: null,
      ahStatus: null,
      address: this.fb.group({
        city: null,
        county: null,
        houseNumber: null,
        streetName: null,
        zip: null,
      }),
      assignedMemberId: null,
      assignedPlayerId: null,
      comment: null,
      contactData: this.fb.group({
        email: null,
        fax: null,
        phoneHome: null,
        phoneMobile: null,
        phoneWork: null
      }),
      id: null,
      birthDate: [null, [Validators.required]],
      firstName: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      gender: [null, [Validators.required]],
      lastName: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      title: null,
      galleries: {
        Profilfotos: null
      },
      image: null,
      creation: this.firestoreService.initCreationFormGroup(),
      publication: this.firestoreService.initPublicationFormGroup(),
      modification: this.firestoreService.initModificationFormArray()
    });
  }

  public getAssignedPlayerOrMember(type: string, playerOrMemberId: string | undefined): Observable<Player | Member | undefined> {
    return this.firestoreService.doc<Player | Member>(`${type}s/${playerOrMemberId}`).valueChanges();
  }

  public async deleteAssignedPlayerOrMember(type: 'players' | 'members', item: Senior): Promise<string> {
    if (type === 'players') {
      delete item.assignedPlayerId;
      delete item.assignedPlayerTitle;
    } else {
      delete item.assignedMemberId;
      delete item.assignedMemberTitle;
    }
    return this.save(item);
  }

  private loadSenior(id: string): Observable<Senior> {
    return this.firestoreService.doc$<Senior>(`seniors/${id}`).pipe(
      map(senior => {
        return this.firestoreService.cleanObject({
          ...senior,
          birthDate: senior.birthDate ? new Date(senior.birthDate) : null,
          entryDate: senior.entryDate ? new Date(senior.entryDate) : null,
          exitDate: senior.exitDate ? new Date(senior.exitDate) : null,
          creation: this.firestoreService.getCreation(senior),
          publication: this.firestoreService.getPublication(senior),
          modification: this.firestoreService.getModification(senior),
          age: this.profileService.calculateAge(senior.birthDate as number)
        });
      }));
  }

  private initNewSenior(): Observable<Senior> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          firstName: '',
          lastName: '',
          ahStatus: '',
          gender: 'männlich',
          birthDate: new Date() as any,
          entryDate: new Date() as any,
          otherData: {},
          address: {},
          contactData: {},
          galleries: {
            Profilfotos: {
              title: 'Profilfotos'
            }
          },
          creation: this.firestoreService.getCreation({}, user),
          publication: this.firestoreService.getPublication({}, user),
          modification: this.firestoreService.getModification({}, { by: user, change: 'NEW' })
        };
      })
    );
  }

  getLatestSignUps(count: number): Observable<Senior[]> {
    return this.firestoreService.col<Senior>(`seniors`, (ref: Query) => {
      ref = ref.where('entryDate', '>=', 0);
      ref = ref.orderBy('entryDate', 'desc');
      ref = ref.limit(count);
      return ref;
    }).valueChanges().pipe(
      map((seniors: Senior[]) => {
        return seniors.map(senior => {
          return {
            ...senior,
            entryDate: senior.entryDate ? new Date(senior.entryDate) : undefined
          };
        });
      })
    );
  }

  getLatestSignedOuts(count: number): Observable<Senior[]> {
    return this.firestoreService.col<Senior>(`seniors`, (ref: Query) => {
      ref = ref.orderBy('exitDate', 'desc');
      ref = ref.limit(count);
      ref = ref.startAfter(null);
      return ref;
    }).valueChanges().pipe(
      map(seniors => {
        return seniors.map((senior) => {
          return {
            ...senior,
            exitDate: senior.exitDate ? new Date(senior.exitDate) : undefined
          };
        });
      })
    );
  }

  getHonoraryList(): Observable<Senior[]> {
    return this.firestoreService.col<Senior>(`seniors`, (ref: Query) => ref.where('ahStatus', '==', 2)).valueChanges();
  }

}
