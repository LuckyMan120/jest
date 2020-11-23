import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Team } from '../../../../../modules/team/_interfaces/team.interface';
import { TeamService } from './../../../../team/team.service';
import { PlayerService } from './../../../player.service';

@Component({

  selector: 'app-player-team-list',
  templateUrl: './player-team-list.component.html',
  styleUrls: ['./player-team-list.component.scss']
})
export class PlayerTeamListComponent implements OnInit {

  @Output() toggleList: EventEmitter<void> = new EventEmitter();

  teams$!: Observable<Team[]>;
  playerId!: string;

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.teams$ = this.route.params.pipe(
      switchMap((params: any) => {
        this.playerId = params.playerId;
        return this.playerService.getAssignedTeamsByPlayerId(params.playerId);
      })
    );
  }

  removePlayerFromTeam(team: Team): Promise<string> {
    return this.teamService.removePlayerFromTeam(this.playerId, team);
  }

}
