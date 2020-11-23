import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TeamService } from './../../team.service';
import { Team } from './../../_interfaces/team.interface';

@Component({

  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  public team$!: Observable<Team>;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService) {
  }

  ngOnInit() {
    this.team$ = this.route.params.pipe(switchMap(params => this.teamService.get(params.teamId)));
  }

}
