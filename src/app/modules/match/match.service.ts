import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Team } from '../team/_interfaces/team.interface';
import { AuthService } from './../../views/pages/auth/auth.service';
import { CalendarService } from './../calendar/calendar.service';
import { MatchEventCategory } from './_interfaces/match-event-category.interface';
import { MatchEvent } from './_interfaces/match-event.interface';
import { Match } from './_interfaces/match.interface';
import { NotEmptyTitleOrDesc } from './_validators/not-empty-title-or-desc.validator';

@Injectable()
export class MatchService {

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private calendarService: CalendarService
  ) {
  }

  private otherEvents: { id: number, title: string }[] = [
    { id: 1, title: 'withoutRating' },
    { id: 2, title: 'cancellation' },
    { id: 3, title: 'gameFailure' },
    { id: 4, title: 'deposition' },
    { id: 5, title: 'annulment' },
    { id: 6, title: 'sportsCourtRuling' },
    { id: 7, title: 'administrativeDecision' },
    { id: 8, title: 'cancellationBothTeams' },
    { id: 9, title: 'cancellationGuestTeam' },
    { id: 10, title: 'cancellationHomeTeam' },
    { id: 11, title: 'onPenalties' },
    { id: 12, title: 'afterOvertime' },
    { id: 13, title: 'noInformation' },
    { id: 14, title: 'withoutResult' },
    { id: 15, title: 'gameRelocated' }
  ];

  public get(id: string): Observable<Match> {
    if (!!!id) {
      return this.initNewMatch();
    } else {
      return this.loadMatch(id);
    }
  }

  public getMatchTitle(match: Match, withDate: boolean = false, withTime: boolean = false): string {
    const titleString = `${match.playersType}: ${match.homeTeam?.title} - ${match.guestTeam?.title}`;
    if (withDate) {
      return withTime
        ? `${titleString} (${this.calendarService.getLocaleDate(match.matchStartDate)}
        ${this.calendarService.getLocaleTime(match.matchStartDate)})`
        : `${titleString} (${this.calendarService.getLocaleDate(match.matchStartDate)})
      `;
    } else {
      return `${match.playersType}: ${match.homeTeam?.title} - ${match.guestTeam?.title}`;
    }
  }

  public initAssignedArticleFormFields(): FormGroup {
    return this.fb.group({
      assignedArticleIds: null
    });
  }

  public getMatchResultFields(matches: Match[]): FormArray {
    return new FormArray(matches.map(match => this.buildResultFields(match)));
  }

  private buildResultFields(match: Match): FormGroup {
    return this.fb.group({
      id: match.id,
      title: this.getMatchTitle(match, true),
      matchStartDate: match.matchStartDate,
      isCompleted: true,
      isOtherEvent: false,
      result: this.fb.group({
        guestTeamGoals: [null, [Validators.required, Validators.pattern('^\\d*$')]],
        homeTeamGoals: [null, [Validators.required, Validators.pattern('^\\d*$')]],
        otherEvent: [{ value: null, disabled: true }, [Validators.required]]
      })
    });
  }

  public getFormFields(): FormGroup {
    return this.fb.group({
      assignedArticleIds: null,
      assignedCategoryIds: [null, [Validators.required]],
      assignedLocationId: [null, [Validators.required]],
      assignedTeamId: [null, [Validators.required]],
      matchStartDate: null,
      matchEndDate: null,
      isCompleted: null,
      isHomeTeam: null,
      isImported: null,
      isOtherEvent: false,
      isOfficialMatch: null,
      matchType: null,
      matchLink: null,
      matchEvents: this.fb.array([]),
      guestTeam: this.fb.group({
        externalTeamLink: null,
        logoURL: null,
        title: null
      }),
      homeTeam: this.fb.group({
        externalTeamLink: null,
        logoURL: null,
        title: null
      }),
      id: [null],
      result: this.fb.group({
        guestTeamGoals: null,
        homeTeamGoals: null,
        otherEvent: null
      }),
      galleries: {
        'Fotos zum Spiel': {
          title: 'Fotos zum Spiel'
        }
      }
    });
  }

  public async save(match: Match): Promise<string> {
    if (match.matchStartDate) {
      match.matchStartDate = match.matchStartDate.valueOf();
    }
    return this.firestoreService.save(match, 'matches', 'match');
  }

  public deleteMatchEvent($event: MatchEvent, match: Match): Promise<string> {
    match.matchEvents?.splice(match.matchEvents?.indexOf($event), 1);
    return this.save(match);
  }


  private loadMatch(id: string): Observable<Match> {
    return this.firestoreService.doc$<Match>(`matches/${id}`).pipe(
      map(match => {
        return {
          ...match,
          matchStartDate: new Date(match.matchStartDate),
          creation: this.firestoreService.getCreation(match),
          publication: this.firestoreService.getPublication(match),
          modification: this.firestoreService.getModification(match)
        };
      })
    );
  }

  public getAssignedTeam(teamId: string): Observable<Team | undefined> {
    return this.firestoreService.doc<Team>(`teams/${teamId}`).valueChanges();
  }

  private initNewMatch(): Observable<Match> {
    return of({
      assignedArticleIds: [],
      assignedCategoryIds: [],
      guestTeam: {
        externalTeamLink: '',
        logoURL: '',
        title: ''
      },
      homeTeam: {
        externalTeamLink: '',
        logoURL: '',
        title: ''
      },
      startingElevenIds: [],
      benchIds: [],
      isHomeTeam: false,
      isOfficialMatch: false,
      matchStartDate: + new Date(),
      galleries: {
        'Fotos zum Spiel': {
          title: 'Fotos zum Spiel'
        }
      },
      matchEvents: []
    });
  }

  public getOtherEventListForMatch(): { id: number, title: string }[] {
    return this.otherEvents.map(event => {
      return {
        id: event.id,
        title: 'match.form.inputs.events.list.' + event.title
      };
    }).sort((a, b) => a.title < b.title ? -1 : 1);
  }

  public getMatchListForDate(startDate: number, endDate: number) {
    return this.firestoreService.col<Match>('matches', (ref: any) => {
      ref = ref.orderBy('matchStartDate', 'asc');
      ref = ref.where('matchStartDate', '>=', startDate);
      ref = ref.where('matchStartDate', '<=', endDate);
      return ref;
    }).valueChanges().pipe(
      map((matches: Match[]) => {
        return matches.map(match => {
          return {
            id: match.id,
            title: match.playersType + ': ' + match.homeTeam?.title + ' - ' + match.guestTeam?.title,
            start: new Date(match.matchStartDate),
            editable: true,
            backgroundColor: (match.homeTeam && match.homeTeam.title.indexOf('zg.') > -1
              || match.guestTeam && match.guestTeam.title.indexOf('zg.') > -1) ? '#ff6600' : '',
            externalUrl: match.matchLink,
            allDay: false
          };
        });
      })
    );
  }

  public getUpcomingMatches(limit: number = 5): Observable<Match[]> {
    const currentDate = new Date();
    return this.firestoreService.col<Match>(`matches`, (ref: any) => {
      ref = ref.where('matchStartDate', '>', currentDate.getTime());
      ref = ref.orderBy('matchStartDate', 'asc');
      ref = ref.limit(limit);
      return ref;
    }).valueChanges();
  }

  public getMatchesWithoutResult(): Observable<Match[]> {
    const currentDate = new Date();
    return this.firestoreService.col<Match>(`matches`, (ref: Query) => {
      ref = ref.where('matchStartDate', '<=', currentDate.valueOf());
      ref = ref.where('isCompleted', '==', false);
      ref = ref.orderBy('matchStartDate', 'asc');
      return ref;
    }).valueChanges().pipe(map((matches: Match[]) => this.generateMatchList(matches)));
  }

  public generateMatchList(matches: Match[]) {
    return matches.map((match: Match) => {
      return {
        ...match,
        title: this.getMatchTitle(match, false, false),
        matchStartDate: `${this.calendarService.getLocaleDate(match.matchStartDate)}
        ${this.calendarService.getLocaleTime(match.matchStartDate)}`
      };
    });
  }

  // Match-Events
  public getMatchEvent(event: MatchEvent): Observable<MatchEvent> {
    if (!!!event) {
      return this.initNewMatchEvent();
    } else {
      return of(event);
    }
  }

  public getEventFormFields(): FormGroup {
    return this.fb.group({
      id: null,
      assignedCategoryId: ['', [Validators.required]],
      description: null,
      playMinute: null,
      title: null,
      assignedPlayerOneId: null,
      assignedPlayerTwoId: null
    }, {
      validator: NotEmptyTitleOrDesc()
    });
  }

  public getEventCategories(): MatchEventCategory[] {
    return [
      {
        id: '0',
        parentCategory: 'match',
        color: 'info',
        title: `Spielbeginn`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '1',
        parentCategory: 'match',
        color: 'info',
        title: `Ende der ersten Halbzeit`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '2',
        parentCategory: 'match',
        color: 'info',
        title: `Beginn der zweiten Halbzeit`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '3',
        parentCategory: 'match',
        color: 'info',
        title: `Ende der zweiten Halbzeit`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '4',
        parentCategory: 'match',
        color: 'info',
        title: `Beginn der Verlängerung`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '5',
        parentCategory: 'match',
        color: 'info',
        title: `Halbzeit der Verlängerung`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '6',
        parentCategory: 'match',
        color: 'info',
        title: `Ende der Verlängerung`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '7',
        parentCategory: 'match',
        color: 'info',
        title: `Elfmeterschießen`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '8',
        parentCategory: 'match',
        color: 'info',
        title: `Spielende`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '9',
        parentCategory: 'match',
        color: 'warning',
        title: `Spielabbruch`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '10',
        parentCategory: 'match',
        title: `Halbzeitfazit`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '11',
        parentCategory: 'match',
        title: `Fazit nach dem Spiel`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '12',
        parentCategory: 'match',
        title: `Nachspielzeit`,
        showTextInput: true,
        inputTitle: `Nachspielzeit`,
        playerOneTitle: '',
        playerTwoTitle: ''
      },
      {
        id: '13',
        parentCategory: 'scene',
        title: `Tor`,
        playerOneTitle: `von`,
        showPlayerOneInput: true,
        playerTwoTitle: `Vorlage von`,
        showPlayerTwoInput: true,
        color: 'success'
      },
      {
        id: '14',
        parentCategory: 'scene',
        title: `Großchance`,
        playerOneTitle: `von`,
        showPlayerOneInput: true,
        playerTwoTitle: `Vorlage von`,
        showPlayerTwoInput: true,
        color: 'brand'
      },
      {
        id: '15',
        parentCategory: 'scene',
        title: `Auswechselung`,
        playerOneTitle: `raus geht`,
        showPlayerOneInput: true,
        playerTwoTitle: `rein kommt`,
        showPlayerTwoInput: true
      },

      {
        id: '16',
        parentCategory: 'punishments',
        title: `gelbe Karte`,
        playerOneTitle: `für`,
        showPlayerOneInput: true,
        playerTwoTitle: ''
      },
      {
        id: '17',
        parentCategory: 'punishments',
        title: `gelb-rote Karte`,
        playerOneTitle: `für`,
        showPlayerOneInput: true,
        playerTwoTitle: ''
      },
      {
        id: '18',
        parentCategory: 'punishments',
        title: `rote Karte`,
        playerOneTitle: `für`,
        showPlayerOneInput: true,
        playerTwoTitle: ''
      },
      {
        id: '19',
        parentCategory: 'punishments',
        title: `Zeitstrafe`,
        playerOneTitle: `für`,
        showPlayerOneInput: true,
        playerTwoTitle: ''
      },
      {
        id: '20',
        parentCategory: 'match',
        title: `Spielvorschau`,
        playerOneTitle: '',
        playerTwoTitle: ''
      }
    ];
  }

  private initNewMatchEvent(): Observable<MatchEvent> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          title: '',
          description: '',
          creation: this.firestoreService.getCreation({}, user.id)
        };
      })
    );
  }

}
