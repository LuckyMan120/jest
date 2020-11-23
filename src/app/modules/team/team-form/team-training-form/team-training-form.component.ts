import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TeamService } from '../../team.service';
import { Training } from '../../training/_interfaces/training.interface';
import { Team } from '../../_interfaces/team.interface';
import { CalendarService } from './../../../calendar/calendar.service';

@Component({

  selector: 'team-training-form',
  templateUrl: './team-training-form.component.html',
  styleUrls: ['./team-training-form.component.scss']
})
export class TeamTrainingFormComponent implements OnInit {

  @Input() showLinks = true;

  public trainings$!: Observable<Training[]>;
  public team!: Team;
  public weekDays!: string[];

  constructor(
    private teamService: TeamService,
    private calendarService: CalendarService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.weekDays = this.calendarService.getLocaleWeek();

    this.trainings$ = this.route.params.pipe(
      switchMap(params => this.teamService.get(params.teamId)),
      tap(team => this.team = team),
      switchMap(team => this.teamService.getTrainingSessions({ teamId: team.id || 'new' }))
    );

  }

  removeTraining(training: Training): void {
    training.title = 'Training';
    this.teamService.deleteTraining(training, this.team);
  }

}
