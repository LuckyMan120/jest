import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Team } from '../../team/_interfaces/team.interface';
import { TeamService } from '../team.service';
import { Training } from '../training/_interfaces/training.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { Season } from './../../../shared/_interfaces/season.interface';
import { CategoryService } from './../../category/category.service';
import { Category } from './../../category/_interfaces/category.interface';

@Component({

  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent implements OnInit {

  public team$!: Observable<Team>;

  categories$!: Observable<Category[]>;
  seasons$!: Observable<Season[]>;
  trainings$!: Observable<Training[]>;

  form!: FormGroup;
  savedTeam!: Team;
  hasFormErrors = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private firestoreService: FirestoreService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    this.form = this.teamService.getFormFields();

    this.team$ = this.route.params.pipe(
      switchMap(params => this.teamService.get(params.teamId)),
      tap((team: Team) => {

        this.form.patchValue(team);

        if (team.internMgmt) {
          (this.form.controls.internMgmt as FormArray).clear();
          team.internMgmt.map((mgmt: any) => {
            this.teamService.initTeamManagement('internMgmt', this.form.controls.internMgmt as FormArray, mgmt);
          });
        }

        if (team.externMgmt) {
          (this.form.controls.externMgmt as FormArray).clear();
          team.externMgmt.map((mgmt: any) => {
            this.teamService.initTeamManagement('externMgmt', this.form.controls.externMgmt as FormArray, mgmt);
          });
        }

        if (team.isImported) {
          this.form.get('title')?.disable();
          this.form.get('subTitle')?.disable();
          this.form.get('assignedSeasonId')?.disable();
          this.form.get('assignedCategoryIds')?.disable();
          this.form.get('isImported')?.disable();
          this.form.get('isOfficialTeam')?.disable();
          this.form.get('externalTeamLink')?.disable();
        }
        this.trainings$ = this.teamService.getTrainingSessions({ teamId: team.id });
        this.savedTeam = Object.freeze(Object.assign({}, team));
        this.seasons$ = this.firestoreService.col<Season>(`seasons`).valueChanges();
        this.categories$ = this.categoryService.getCategoryListByParentCategoryTitle('Mannschaftsarten');
      }),
    );

  }

  get assignedPlayersControl() {
    return this.form.controls.assignedPlayerIds;
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.teamService.save(this.form.getRawValue() as Team).then(() => {
      if (withBack) {
        this.redirectToList();
      }
    });
  }

  /* public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  } */

  cancel(): void {
    this.redirectToList();
  }

  redirectToList(): void {
    this.router.navigate(['/teams']).then();
  }

  deleteTeam(team: Team): void {
    this.firestoreService.removeItem('teams', team, '/teams/list');
  }

  reset(): void {
    this.form.patchValue(this.savedTeam);
  }

  onAlertClose(): void {
    this.hasFormErrors = false;
  }

  updateControl($event: any): void {
    const control = this.form.controls.galleries;
    control.setValue($event);
    control.markAsDirty();
  }

}
