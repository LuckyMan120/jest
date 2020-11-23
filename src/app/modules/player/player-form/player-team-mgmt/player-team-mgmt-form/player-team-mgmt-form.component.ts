import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Category } from '../../../../category/_interfaces/category.interface';
import { Player } from '../../../_interfaces/player.interface';
import { CategoryService } from './../../../../category/category.service';
import { TeamService } from './../../../../team/team.service';
import { PlayerService } from './../../../player.service';

@Component({

  selector: 'app-player-team-mgmt-form',
  templateUrl: './player-team-mgmt-form.component.html',
  styleUrls: ['./player-team-mgmt-form.component.scss']
})
export class PlayerTeamMgmtFormComponent implements OnInit {

  @Output() toggleList: EventEmitter<void> = new EventEmitter();

  form!: FormGroup;
  hasFormErrors = false;
  player$!: Observable<Player | undefined>;
  playerId!: string | undefined;
  filteredCategories$!: Observable<Category[]>;

  constructor(
    private categoryService: CategoryService,
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.form = this.playerService.getPlayerTeamPositionFormFields();

    this.player$ = this.route.params.pipe(
      switchMap(params => this.playerService.get(params.playerId)),
      tap(player => this.playerId = player?.id)
    );

    this.filteredCategories$ = this.categoryService.getCategoryListByParentCategoryTitle('Mannschaftsinterne Aufgaben');
  }

  get assignedTeamControl() {
    return this.form.controls.teamId;
  }

  onSubmit(): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.teamService.createTeamManagement('internMgmt', {
      assignedPlayerId: this.playerId,
      ...this.form.getRawValue()
    }).then(() => this.toggleList.emit());
  }

}
