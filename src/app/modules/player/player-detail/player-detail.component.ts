import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Team } from './../../team/_interfaces/team.interface';
import { PlayerService } from './../player.service';
import { Player } from './../_interfaces/player.interface';

@Component({

  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss']
})
export class PlayerDetailComponent implements OnInit {

  player$!: Observable<Player | undefined>;
  teams$!: Observable<Team[]>;
  internTeamMgmt$!: Observable<Team[]>;

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private firestoreService: FirestoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.player$ = this.route.params.pipe(
      tap((params) => {
        this.teams$ = this.playerService.getAssignedTeamsByPlayerId(params.playerId);
        this.internTeamMgmt$ = this.playerService.getAssignedInternTeamManagementsByPlayerId(params.playerId);
      }),
      switchMap(params => this.playerService.get(params.playerId)),
      tap(player => {
        if (!player) {
          this.router.navigate(['/players/list']);
        }
      })
    );
  }

  deletePlayer(item: Player): void {
    item.title = this.firestoreService.getUserTitle(item);
    return this.firestoreService.removeItem('players', item, '/players/list');
  }

  deleteAssignedMember(player: Player): Promise<string> {
    delete player.assignedMemberId;
    delete player.assignedMemberTitle;
    return this.playerService.save(player);
  }

  deleteAssignedSenior(player: Player): Promise<string> {
    delete player.assignedSeniorId;
    delete player.assignedSeniorTitle;
    return this.playerService.save(player);
  }

  deletePlayerFromTeam(team: Team, player: Player): Promise<void> {
    return this.playerService.deletePlayerToTeam(team, player);
  }

  deleteInternTeamManagement(team: Team, player: Player): Promise<void> {
    return this.playerService.deletePlayerToTeamManagement(team, player);
  }

}
