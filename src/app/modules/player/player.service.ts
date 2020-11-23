import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from '../../views/pages/auth/auth.service';
import { ProfileService } from './../../shared/services/profile.service';
import { Member } from './../member/_interfaces/member.interface';
import { Senior } from './../senior/_interfaces/senior.interface';
import { Team } from './../team/_interfaces/team.interface';
import { Player } from './_interfaces/player.interface';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private profileService: ProfileService
  ) {
  }

  public get(id: string): Observable<Player | undefined> {
    return !!!id ? this.initNewPlayer() : this.loadPlayer(id);
  }

  public save(player: Player): Promise<string> {
    if (!player.id) { player.id = player.passNumber + ''; }
    if (player.birthDate) { player.birthDate = player.birthDate.valueOf(); }
    if (player.officialMatches) { player.birthDate = player.officialMatches.valueOf(); }
    if (player.friendlyMatches) { player.birthDate = player.friendlyMatches.valueOf(); }
    if (player.signOut) { player.birthDate = player.signOut.valueOf(); }
    if (player.passPrint) { player.birthDate = player.passPrint.valueOf(); }
    return this.firestoreService.save(player, 'players', 'player');
  }

  public getPlayerTeamPositionFormFields(): FormGroup {
    return this.fb.group({
      teamId: [null, [Validators.required]],
      assignedCategoryId: [null, [Validators.required]]
    });
  }

  public getPlayerFormFields(): FormGroup {
    return this.fb.group({
      id: null,
      assignedMemberId: null,
      assignedSeniorId: null,
      birthDate: [null, [Validators.required]],
      firstName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      lastName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      passNumber: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      ageGroup: null,
      friendlyMatches: null,
      officialMatches: null,
      signOut: null,
      playerStatus: null,
      status: null,
      homeClub: null,
      galleries: {
        Profilfotos: {
          title: 'Profilfotos'
        }
      },
      guestPlayer: this.fb.group({
        guestRight: null,
        season: null,
        type: null
      }),
      passPrint: null,
      image: null,
      creation: this.firestoreService.initCreationFormGroup(),
      publication: this.firestoreService.initPublicationFormGroup(),
      modification: this.firestoreService.initModificationFormArray()
    });
  }

  public getTeamPlayerFormFields(): FormGroup {
    return this.fb.group({
      assignedTeamIds: [null, [Validators.required]]
    });
  }

  private loadPlayer(id: string): Observable<Player | undefined> {
    return this.firestoreService.doc$<Player>(`players/${id}`).pipe(
      map(player => {
        if (!player) {
          return undefined;
        }
        return this.firestoreService.cleanObject({
          ...player,
          birthDate: player.birthDate ? new Date(player.birthDate as number) : null,
          signOut: player.signOut ? new Date(player.signOut as number) : null,
          passPrint: player.passPrint ? new Date(player.passPrint as number) : null,
          friendlyMatches: player.friendlyMatches ? new Date(player.friendlyMatches as number) : null,
          officialMatches: player.officialMatches ? new Date(player.officialMatches as number) : null,
          creation: this.firestoreService.getCreation(player),
          publication: this.firestoreService.getPublication(player),
          modification: this.firestoreService.getModification(player),
          age: this.profileService.calculateAge(player.birthDate as number)
        });
      })
    );
  }

  public getMemberSuggestions(player: Player): Observable<Member[]> {
    return this.firestoreService.col<Member>(`members`, (ref: Query) => {
      ref = ref.where('firstName', '==', player.firstName);
      ref = ref.where('lastName', '==', player.lastName);
      return ref;
    }).valueChanges();
  }

  public getAssignedTeamsByPlayerId(playerId: string): Observable<Team[]> {
    return this.firestoreService.col$<Team>(`teams`, (ref: Query) => ref.where('assignedPlayerIds', 'array-contains', playerId));
  }

  public getAssignedInternTeamManagementsByPlayerId(playerId: string): Observable<Team[]> {
    return this.firestoreService.col$<Team>(`teams`, (ref: Query) => ref.where('internMgmtPlayerIds', 'array-contains', playerId));
  }

  public getAssignedMemberOrSenior(type: string, memberOrSeniorId: string | undefined): Observable<Member | Senior | undefined> {
    return this.firestoreService.doc<Member | Senior>(`${type}s/${memberOrSeniorId}`).valueChanges();
  }

  private initNewPlayer(): Observable<Player> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          lastName: '',
          firstName: '',
          birthDate: new Date(),
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

  getDetailedPlayerStatistics(): Observable<any[]> {
    return this.firestoreService.col<Player>(`players`).valueChanges();
  }

  getLatestPlayers(count: number): Observable<Player[]> {
    return this.firestoreService.col<Player>(`players`, (ref: Query) => {
      ref = ref.orderBy('friendlyMatches', 'desc');
      ref = ref.limit(count);
      return ref;
    }).valueChanges().pipe(
      map((players) => {
        return players.map(player => {
          return {
            ...player,
            friendlyMatches: player.friendlyMatches ? new Date(player.friendlyMatches) : undefined
          };
        });
      })
    );
  }

  getPlayersByAge(count: number, sortDirection: any): Observable<Player[]> {
    return this.firestoreService.col<Player>(`players`, (ref: Query) => {
      ref = ref.orderBy('birthDate', sortDirection);
      ref = ref.limit(count);
      return ref;
    }).valueChanges().pipe(
      map((players) => {
        return players.map(player => {
          return { ...player, birthDate: player.birthDate ? new Date(player.birthDate) : undefined };
        });
      })
    );
  }

  getGuestPlayers(): Observable<Player[]> {
    return this.firestoreService.col<Player>(`players`, (ref: Query) => ref.where('guestPlayer.type', '==', 'Gastspielrecht'))
      .valueChanges().pipe(
        map((players) => {
          return players.map(player => {
            return { ...player, birthDate: player.birthDate ? new Date(player.birthDate) : undefined };
          });
        })
      );
  }

  deletePlayerToTeamManagement(team: Team, player: Player): Promise<void> {
    const idx = team.internMgmtPlayerIds?.indexOf(player.id as string);
    if (idx) {
      team.internMgmtPlayerIds?.splice(idx, 1);
      team.internMgmtCategoryIds?.splice(idx, 1);
    }
    return this.firestoreService.doc(`teams/${team.id}`).set(team, { merge: true });
  }

  deletePlayerToTeam(team: Team, player: Player): Promise<void> {
    team.assignedPlayerIds = team.assignedPlayerIds?.filter(id => id !== player.id);
    team.assignedPlayerTitles = team.assignedPlayerTitles?.filter(title => title !== this.firestoreService.getUserTitle(player));
    return this.firestoreService.doc(`teams/${team.id}`).set(team, { merge: true });
  }

}
