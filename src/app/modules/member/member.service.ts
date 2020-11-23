import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from '../../views/pages/auth/auth.service';
import { Senior } from '../senior/_interfaces/senior.interface';
import { ClubHonorary } from './../club/_interfaces/club-honorary.interface';
import { ClubManagement } from './../club/_interfaces/club-management.interface';
import { Player } from './../player/_interfaces/player.interface';
import { Member } from './_interfaces/member.interface';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
  }

  public getMemberTeamPositionFormFields(): FormGroup {
    return this.fb.group({
      teamId: [null, [Validators.required]],
      assignedCategoryId: [null, [Validators.required]]
    });
  }

  public getMemberFormFields(): FormGroup {
    return this.fb.group({
      address: this.fb.group({
        city: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        county: null,
        houseNumber: null,
        streetName: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
        zip: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(8)]],
      }),
      assignedSeniorId: null,
      assignedPlayerId: null,
      entryDate: null,
      exitDate: null,
      fee: null,
      clubStatus: null,
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
      creation: this.firestoreService.initCreationFormGroup(),
      publication: this.firestoreService.initPublicationFormGroup(),
      modification: this.firestoreService.initModificationFormArray()
    });
  }

  public save(member: Member): Promise<string> {
    if (member.birthDate) { member.birthDate = member.birthDate.valueOf(); }
    if (member.entryDate) { member.entryDate = member.entryDate.valueOf(); }
    if (member.exitDate) { member.exitDate = member.exitDate.valueOf(); } else { member.exitDate = null; }
    return this.firestoreService.save(member, 'members', 'member');
  }

  public get(id: string): Observable<Member | undefined> {
    return !!!id ? this.initNewMember() : this.loadMember(id);
  }

  public getAssignedPlayerOrSenior(type: string, playerOrSeniorId: string | undefined): Observable<Player | Senior | undefined> {
    return this.firestoreService.doc<Player | Senior>(`${type}s/${playerOrSeniorId}`).valueChanges();
  }

  public getSuggestedPlayersOrSeniors(type: string, member: Member): Observable<(Player | Senior)[]> {
    return this.firestoreService.col<Player | Senior>(`${type}s`, (ref: Query) => {
      ref = ref.where('firstName', '==', member.firstName);
      ref = ref.where('lastName', '==', member.lastName);
      return ref;
    }).valueChanges();
  }

  public async deleteAssignedPlayerOrSenior(type: string, member: Member): Promise<string> {
    if (type === 'player') {
      delete member.assignedPlayerId; delete member.assignedPlayerTitle;
    } else {
      delete member.assignedSeniorId; delete member.assignedSeniorTitle;
    }
    return this.save(member);
  }

  public getClubManagementByMemberId(memberId: string | undefined): Observable<ClubManagement[]> {
    return this.firestoreService.col<ClubManagement>(`club-management`, (ref: Query) => {
      return ref = ref.where('assignedMemberId', '==', memberId);
    }).valueChanges()
      .pipe(
        map((mgmtList: ClubManagement[]) => {
          return mgmtList.map((mgmt: ClubManagement) => {
            return {
              ...mgmt,
              startDate: new Date(mgmt.startDate) as any,
              endDate: mgmt.endDate ? new Date(mgmt.endDate) as any : null
            };
          });
        })
      );
  }

  public getHonoraryByMemberId(memberId: string | undefined): Observable<ClubHonorary | undefined> {
    return this.firestoreService.col$<ClubHonorary>(`club-honorary`, (ref: Query) => {
      return ref.where('assignedMemberId', '==', memberId);
    }).pipe(
      map((honoraries: ClubHonorary[]) => {
        if (!honoraries) {
          return;
        }
        return honoraries[0];
      })
    );
  }

  private loadMember(id: string): Observable<Member | undefined> {
    return this.firestoreService.doc$<Member>(`members/${id}`).pipe(
      map(member => {
        return {
          ...member,
          birthDate: member.birthDate ? new Date(member.birthDate) : null,
          entryDate: member.entryDate ? new Date(member.entryDate) : null,
          exitDate: member.exitDate ? new Date(member.exitDate) : undefined,
          creation: this.firestoreService.getCreation(member),
          publication: this.firestoreService.getPublication(member),
          modification: this.firestoreService.getModification(member)
        };
      })
    );
  }

  private initNewMember(): Observable<Member> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          clubStatus: '',
          gender: 'männlich',
          birthDate: new Date(),
          entryDate: new Date(),
          otherData: {},
          address: {},
          contactData: {},
          galleries: {
            Profilfotos: {
              title: 'Profilfotos'
            }
          },
          fee: 0,
          firstName: '',
          lastName: '',
          info: '',
          comment: '',
          creation: this.firestoreService.getCreation({}, user),
          publication: this.firestoreService.getPublication({}, user),
          modification: this.firestoreService.getModification({}, { by: user, change: 'NEW' })
        };
      })
    );
  }

  getLatestSignUps(count: number): Observable<Member[]> {
    return this.firestoreService.col<Member>(`members`, (ref: Query) => {
      ref = ref.where('entryDate', '>=', 0);
      ref = ref.orderBy('entryDate', 'desc');
      ref = ref.limit(count);
      return ref;
    }).valueChanges().pipe(
      map((members: Member[]) => {
        return members.map(member => {
          return {
            ...member,
            entryDate: member.entryDate ? new Date(member.entryDate) : null
          };
        });
      })
    );
  }

  getLatestSignedOuts(count: number): Observable<Member[]> {
    return this.firestoreService.col<Member>(`members`, (ref: Query) => {
      ref = ref.orderBy('exitDate', 'desc');
      ref = ref.limit(count);
      return ref;
    })
      .valueChanges()
      .pipe(
        map(members => {
          return members.map((member) => {
            return {
              ...member,
              exitDate: member.exitDate ? new Date(member.exitDate) : undefined
            };
          });
        })
      );
  }

}
