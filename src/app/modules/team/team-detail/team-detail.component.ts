import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TeamService } from '../team.service';
import { Training } from '../training/_interfaces/training.interface';
import { Team } from '../_interfaces/team.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';

@Component({

  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit {

  public team$!: Observable<Team>;
  public trainings$!: Observable<Training[]>;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private teamService: TeamService
  ) {
  }

  ngOnInit() {
    this.team$ = this.route.params.pipe(
      switchMap(params => this.teamService.get(params.teamId)),
      tap(team => this.trainings$ = this.teamService.getTrainingSessions({ teamId: team.id }))
    );
  }

  deleteTeam(team: Team) {
    this.firestoreService.removeItem('teams', team, '/teams/list');
  }

}
