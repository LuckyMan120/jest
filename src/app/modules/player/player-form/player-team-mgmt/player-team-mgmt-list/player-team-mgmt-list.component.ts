import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Team } from '../../../../team/_interfaces/team.interface';
import { Player } from '../../../_interfaces/player.interface';
import { TeamService } from './../../../../team/team.service';
import { TeamInternManagement } from './../../../../team/_interfaces/team-management.interface';
import { PlayerService } from './../../../player.service';

@Component({

  selector: 'app-player-team-mgmt-list',
  templateUrl: './player-team-mgmt-list.component.html',
  styleUrls: ['./player-team-mgmt-list.component.scss']
})
export class PlayerTeamMgmtListComponent implements OnInit {

  @Output() toggleList: EventEmitter<void> = new EventEmitter();

  teams$!: Observable<Team[]>;
  player$!: Observable<Player | undefined>;

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.player$ = this.route.params.pipe(
      switchMap((params: any) => this.playerService.get(params.playerId)),
      tap(player => this.teams$ = this.teamService.getTeamManagementById('internMgmt', player?.id))
    );
  }

  removeTeamInternMgmtPosition(team: Team, mgmt: TeamInternManagement): Promise<string> {
    return this.teamService.removeTeamMgmtPosition('internMgmt', team, mgmt);
  }

}
