import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TeamService } from './../../../../team/team.service';
import { Team } from './../../../../team/_interfaces/team.interface';
import { PlayerService } from './../../../player.service';

@Component({

  selector: 'app-player-team-form',
  templateUrl: './player-team-form.component.html',
  styleUrls: ['./player-team-form.component.scss']
})
export class PlayerTeamFormComponent implements OnInit {

  @Output() toggleList: EventEmitter<void> = new EventEmitter();

  teams$!: Observable<Team[]>;
  playerId!: string;

  form!: FormGroup;
  hasFormErrors = false;
  savedValue: any;

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.form = this.playerService.getTeamPlayerFormFields();

    this.teams$ = this.route.params.pipe(
      switchMap((params: any) => {
        this.playerId = params.playerId;
        return this.playerService.getAssignedTeamsByPlayerId(params.playerId);
      }),
      map(teams => {
        this.form.get('assignedTeamIds')?.setValue(teams.map(team => team.id));
        this.savedValue = Object.freeze(Object.assign({}, this.form.getRawValue()));
        return teams;
      })
    );
  }

  get assignedTeamsControl() {
    return this.form.controls.assignedTeamIds;
  }

  async onSubmit(): Promise<void> {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    await this.teamService.assignPlayerToTeams(this.playerId, this.form.get('assignedTeamIds')?.value);
    return this.toggleList.emit();
  }

  resetForm() {
    this.form.setValue(this.savedValue);
  }

}
