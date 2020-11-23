import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Team } from '../../team/_interfaces/team.interface';
import { MatchService } from './../match.service';
import { Match } from './../_interfaces/match.interface';

@Component({

  selector: 'app-match-formation',
  templateUrl: './match-formation.component.html',
  styleUrls: ['./match-formation.component.scss']
})
export class MatchFormationComponent implements OnInit {

  data$!: Observable<{ match: Match, team: Team | undefined }>;
  data!: { match: Match, team: Team | undefined };

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  bankSeats = new Array(7);

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService
  ) { }

  ngOnInit() {
    const matchObservable = this.route.params.pipe(
      switchMap((params: any) => this.matchService.get(params.matchId))
    );

    const teamObservable = matchObservable.pipe(
      switchMap((match: Match) => this.matchService.getAssignedTeam(match?.assignedTeamId as string))
    );

    this.data$ = combineLatest([matchObservable, teamObservable]).pipe(
      map((x: [Match, Team | undefined]) => {
        this.data = { match: x[0], team: x[1] };
        return { match: x[0], team: x[1] };
      }),
      tap(_ => this.isLoading$.next(false))
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(this.data.match);
  }

  /* this.setPlayerPositions($event.value);
  this.initializeFieldPositions();

  this.playerList = this.playerList.concat(this.assignedTeamPlayers
    .filter(player => this.match.startingEleven.find(e => e.memberId === player.id))) */

}
