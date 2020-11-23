import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Location } from '../location/_interfaces/location.interface';
import { Season } from './../../shared/_interfaces/season.interface';
import { AuthService } from './../../views/pages/auth/auth.service';
import { Article } from './../article/_interfaces/article.interface';
import { Match } from './../match/_interfaces/match.interface';
import { Training } from './training/_interfaces/training.interface';
import { TeamExternManagement, TeamInternManagement } from './_interfaces/team-management.interface';
import { Team } from './_interfaces/team.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
  }

  public getSeasonList(): Observable<Season[]> {
    return this.firestoreService.col<Season>(`seasons`, (ref: Query) => ref.orderBy('title', 'desc')).valueChanges();
  }

  public get(id: string): Observable<Team> {
    if (!!!id) {
      return this.initNewTeam();
    } else {
      return this.loadTeam(id);
    }
  }

  public getFormFields(): FormGroup {
    return this.fb.group({
      title: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      subTitle: [null],
      id: [null],
      assignedSeasonId: [null, [Validators.required]],
      externalTeamLink: [null],
      isImported: [null],
      isMainTeam: [null],
      isOfficialTeam: [null],
      isSignedOut: [null],
      isValid: [null],
      internMgmt: this.fb.array([]),
      internMgmtCategoryIds: [],
      internMgmtPlayerIds: [],
      externMgmt: this.fb.array([]),
      externMgmtCategoryIds: [],
      externMgmtMemberIds: [],
      logoURL: [null],
      displayInMainMenu: [null],
      homeAwayStandings: null,
      assignedCategoryIds: [null, [Validators.required]],
      info: [null],
      assignedPlayerIds: [null],
      galleries: {
        Profilfotos: {
          title: 'Profilfotos'
        }
      },
      roundStandings: null,
      standings: null,
      teamInfo: null,
      imageUrl: null,
      ticker: null,
      competitions: [],
      creation: this.firestoreService.initCreationFormGroup(),
      publication: this.firestoreService.initPublicationFormGroup(),
      modification: this.firestoreService.initModificationFormArray()
    });
  }

  public async save(team: Team): Promise<string> {
    /* team.internMgmtCategoryIds = [];
    team.internMgmtPlayerIds = [];
    team.internMgmt.map((mgmt: TeamInternManagement, idx: number) => {
      team.internMgmtCategoryIds.push(mgmt.assignedCategoryId);
      team.internMgmtPlayerIds.push(mgmt.assignedPlayerId);
    });
    team.externMgmtCategoryIds = [];
    team.externMgmtMemberIds = [];
    team.externMgmt.map((mgmt: TeamExternManagement, idx: number) => {
      team.externMgmtCategoryIds.push(mgmt.assignedCategoryId);
      team.externMgmtMemberIds.push(mgmt.assignedMemberId);
    }); */
    return this.firestoreService.save(team, 'teams', 'team');
  }

  private loadTeam(id: string): Observable<Team> {
    return this.firestoreService.doc$<Team>(`teams/${id}`).pipe(
      map((team) => {
        return {
          ...team,
          creation: this.firestoreService.getCreation(team),
          publication: this.firestoreService.getPublication(team),
          modification: this.firestoreService.getModification(team)
        };
      })
    );
  }

  private initNewTeam(): Observable<Team> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          assignedPlayerIds: [],
          assignedCategoryIds: [],
          competitions: [],
          displayInMainMenu: false,
          externMgmt: [],
          externMgmtMemberIds: [],
          externMgmtCategoryIds: [],
          externalTeamLink: '',
          galleries: {
            Mannschaftsfotos: {
              title: 'Mannschaftsfotos'
            }
          },
          isImported: false,
          isMainTeam: false,
          isOfficialTeam: false,
          isSignedOut: false,
          isValid: true,
          creation: this.firestoreService.getCreation({}, user),
          publication: this.firestoreService.getPublication({}, user),
          modification: this.firestoreService.getModification({}, { by: user, change: 'NEW' }),
          imageUrl: '',
          internMgmt: [],
          internMgmtPlayerIds: [],
          internMgmtCategoryIds: [],
          logoURL: '',
          subTitle: '',
          ticker: [],
          title: ''
        };
      })
    );
  }

  public getAssignedContent(teamId: string | undefined, type: string = 'articles' || 'matches'): Observable<(Article | Match)[]> {
    return this.firestoreService.col<Article | Match>(type, (ref: Query) => {
      return type === 'articles' ? ref.where('assignedTeamIds', 'array-contains', teamId) : ref.where('assignedTeamId', '==', teamId);
    }).valueChanges();
  }

  public async assignTeamToItems(teamId: string, data: { type: 'articles' | 'matches', assignedItemIds: string[] }): Promise<any> {
    /*
    // Delete old assignments if itemId not in new assignedItemIds[]
    const oldItems = await this.firestoreService.col<Article | Match>(data.type, (ref: Query) => {
      return data.type === 'articles' ? ref.where('assignedTeamIds', 'array-contains', teamId) : ref.where('assignedTeamId', '==', teamId);
    }).valueChanges().pipe(take(1)).toPromise();

    const deleteAssignments: any = [];
    oldItems.map((item: any) => {
      if (data.type === 'articles' && data.assignedItemIds.indexOf(item.id) === -1) {
        (item as Article).assignedTeamIds?.splice(item.assignedTeamIds.indexOf(teamId));
        deleteAssignments.push(item);
      }
      if (data.type === 'matches' && data.assignedItemIds.indexOf(item.id) === -1) {
        (item as Match).assignedTeamId = undefined;
        deleteAssignments.push(item);
      }
    });
    this.firestoreService.updateMultiple(data.type, deleteAssignments);

    // add new assignments
    const items = await this.firestoreService.getMultipleDocs(data.type, data.assignedItemIds) as any[];
    const updateAssignments = [];
    for (const item of items) {
      if (data.type === 'articles') {
        if (!('assignedTeamIds' in item)) {
          item.assignedTeamIds = [];
        }
        if (item.assignedTeamIds.indexOf(teamId) === -1) {
          item.assignedTeamIds.push(teamId);
          updateAssignments.push(item);
        }
      }
      if (data.type === 'matches' && item.assignedTeamId !== teamId) {
        (item as Match).assignedTeamId = teamId;
        updateAssignments.push(item);
      }
    }
    return this.firestoreService.updateMultiple(data.type, updateAssignments, true);
    */
    console.log('TODO');
  }

  /**
   * Add a new player to a team
   * @param playerId string
   * @param team Team
   */
  public async assignPlayerToTeams(playerId: string, teamIds: string[]): Promise<any> {
    console.log('TODO');
    /* const teams = await this.firestoreService.getMultipleDocs('teams', teamIds) as Team[];
    return teams.map(team => {
      team.assignedPlayerIds ? team.assignedPlayerIds.push(playerId) : team.assignedPlayerIds = [playerId];
      return this.save(team);
    }); */
  }

  /**
   * Removes a player from the team´s player list
   * @param playerId string
   * @param team Team
   */
  public removePlayerFromTeam(playerId: string, team: Team): Promise<string> {
    const idx = team.assignedPlayerIds?.indexOf(playerId);
    if (idx) {
      team.assignedPlayerIds?.splice(idx, 1);
      team.assignedPlayerTitles?.splice(idx, 1);
    }
    return this.firestoreService.update(`teams/${team.id}`, team);
  }

  /**
   * TeamManagement
   */
  public async createTeamManagement(type: string, data: {
    assignedPlayerId?: string,
    assignedMemberId?: string,
    assignedCategoryId: string,
    teamId: string
  }): Promise<string | void> {
    const team = await this.firestoreService.doc<Team>(`/teams/${data.teamId}`).valueChanges().pipe(take(1)).toPromise();

    if (!team) {
      return;
    }

    const assignedPlayerId = data.assignedPlayerId;
    const assignedMemberId = data.assignedMemberId;
    const assignedCategoryId = data.assignedCategoryId;

    if (type === 'internMgmt' && assignedPlayerId) {
      // eslint-disable-next-line
      team.internMgmt ? team.internMgmt.push({ assignedCategoryId, assignedPlayerId }) : team.internMgmt = [{ assignedCategoryId, assignedPlayerId }];
      team.internMgmtCategoryIds ? team.internMgmtCategoryIds.push(assignedCategoryId) : team.internMgmtCategoryIds = [assignedCategoryId];
      team.internMgmtPlayerIds ? team.internMgmtPlayerIds.push(assignedPlayerId) : team.internMgmtPlayerIds = [assignedPlayerId];
    }

    if (type === 'externMgmt' && assignedMemberId) {
      // eslint-disable-next-line
      team.externMgmt ? team.externMgmt.push({ assignedCategoryId, assignedMemberId }) : team.externMgmt = [{ assignedCategoryId, assignedMemberId }];
      team.externMgmtCategoryIds ? team.externMgmtCategoryIds.push(assignedCategoryId) : team.externMgmtCategoryIds = [assignedCategoryId];
      team.externMgmtMemberIds ? team.externMgmtMemberIds.push(assignedMemberId) : team.externMgmtMemberIds = [assignedMemberId];
    }
    return this.save(team);
  }

  public removeTeamMgmtPosition(
    type: 'externMgmt' | 'internMgmt', team: Team,
    mgmt: TeamInternManagement | TeamExternManagement): Promise<string> {
    // eslint-disable-next-line
    const idx = type === 'internMgmt' ? team.internMgmt?.indexOf(mgmt as TeamInternManagement) : team.externMgmt?.indexOf(mgmt as TeamExternManagement);

    if (idx) {
      type === 'internMgmt' ? team.internMgmt?.splice(idx, 1) : team.externMgmt?.splice(idx, 1);
      type === 'internMgmt' ? team.internMgmtPlayerIds?.splice(idx, 1) : team.externMgmtMemberIds?.splice(idx, 1);
      type === 'internMgmt' ? team.internMgmtCategoryIds?.splice(idx, 1) : team.externMgmtCategoryIds?.splice(idx, 1);
    }
    return this.save(team);
  }


  public initTeamManagement(type: string = 'internMgmt', control: FormArray, mgmt?: TeamInternManagement | TeamExternManagement): void {
    if (type === 'internMgmt') {
      const internMgmt = mgmt as TeamInternManagement;
      control.push(this.fb.group({
        assignedPlayerId: [internMgmt ? internMgmt.assignedPlayerId : null, [Validators.required]],
        assignedCategoryId: [internMgmt ? internMgmt.assignedCategoryId : null, [Validators.required]]
      }));
    } else {
      const externMgmt = mgmt as TeamExternManagement;
      control.push(this.fb.group({
        assignedMemberId: [externMgmt ? externMgmt.assignedMemberId : null, [Validators.required]],
        assignedCategoryId: [externMgmt ? externMgmt.assignedCategoryId : null, [Validators.required]]
      }));
    }
  }


  public getTeamManagementById(type: string, memberId: string | undefined): Observable<Team[]> {
    return this.firestoreService.col<Team>(`teams`, (ref: Query) => {
      ref = type === 'internMgmt'
        ? ref.where('internMgmtPlayerIds', 'array-contains', memberId)
        : ref.where('externMgmtMemberIds', 'array-contains', memberId);
      return ref;
    }).valueChanges();
  }

  /******
   * Training-Functions
   */

  public getTraining(id: string): Observable<Training> {
    return (!!!id) ? this.initNewTraining() : this.loadTraining(id);
  }

  private loadTraining(id: string): Observable<Training> {
    return this.firestoreService.doc$<Training>(`trainings/${id}`).pipe(
      map(training => {
        return {
          ...training,
          startTime: new Date(training.startTime) as any,
          endTime: new Date(training.endTime) as any
        };
      })
    );
  }

  public getTrainingFormFields() {
    return this.fb.group({
      assignedSeasonId: [null, [Validators.required]],
      assignedTeamIds: [null, [Validators.required]],
      assignedLocationId: [null, [Validators.required]],
      day: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      comment: null,
      id: null
    });
  }

  private initNewTraining(): Observable<Training> {
    return of({
      assignedLocationId: '',
      assignedSeasonId: '',
      assignedTeamIds: [],
      startTime: new Date(),
      endTime: new Date(),
      day: 0,
      comment: '',
      title: ''
    });
  }

  public async saveTraining(training: Training): Promise<string> {
    return this.firestoreService.save(training, 'trainings', 'training');
  }

  public deleteTraining(training: Training, team?: Team): void {
    if (team && training.assignedTeamIds.length > 0) {
      const idx = training.assignedTeamIds.indexOf(team.id as string);
      training.assignedTeamIds = training.assignedTeamIds.slice(0, idx);
      // .concat(training.assignedTeamIds.slice(idx + 1, training.assignedTeamIds.length))

      training.assignedTeamTitles = training.assignedTeamTitles?.slice(0, idx);
      // .concat(training.assignedTeamTitles.slice(idx + 1, training.assignedTeamTitles.length))
      this.saveTraining(training);
    } else {
      return this.firestoreService.removeItem('trainings', training, '/teams/edit');
    }
  }

  public getTrainingLocations(): Observable<Location[]> {
    return this.firestoreService.col<Training>(`trainings`).valueChanges().pipe(
      switchMap((trainings: Training[]) => combineLatest(
        trainings.map(training => this.getTrainingLocationById(training.assignedLocationId)))
      )
    );
  }

  public getTrainingLocationById(locationId: string): Observable<Location> {
    return this.firestoreService.doc$<Location>(`locations/${locationId}`);
  }

  public getTrainingSessions(filter: { teamId?: string, seasonId?: string, locationId?: string }): Observable<Training[]> {
    return this.firestoreService.col$<Training>('trainings', (ref: Query) => {
      if (filter.seasonId) {
        ref = ref.where('assignedSeasonId', '==', filter.seasonId);
      }
      if (filter.locationId) {
        ref = ref.where('assignedLocationId', '==', filter.locationId);
      }
      if (filter.teamId) {
        ref = ref.where('assignedTeamIds', 'array-contains', filter.teamId);
      }
      return ref;
    }).pipe(
      map(trainings => trainings.map(training => {
        return {
          ...training,
          endSlot: training.endSlot ? training.endSlot?.slice(0, 2) + training.endSlot?.slice(3) : '',
          startSlot: training.startSlot ? training.startSlot?.slice(0, 2) + training.startSlot?.slice(3) : ''
        };
      })
      )
    );
  }

}
