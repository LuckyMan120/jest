import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Article } from '../../article/_interfaces/article.interface';
import { Category } from '../../category/_interfaces/category.interface';
import { Location } from '../../location/_interfaces/location.interface';
import { Team } from '../../team/_interfaces/team.interface';
import { MatchService } from '../match.service';
import { Match } from '../_interfaces/match.interface';

@Component({

  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.scss']
})
export class MatchFormComponent implements OnInit {

  public match!: Match;
  public match$!: Observable<Match>;

  articles$!: Observable<Article[]>;
  categories$!: Observable<Category[]>;
  locations$!: Observable<Location[]>;
  teams$!: Observable<Team[]>;

  form!: FormGroup;
  savedMatch!: Match;
  hasFormErrors = false;

  otherMatchEvents!: {
    id: number;
    title: string
  }[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
    this.form = this.matchService.getFormFields();

    this.match$ = this.route.params.pipe(
      switchMap(params => this.matchService.get(params.matchId)),
      tap((match: Match) => {
        this.form.patchValue(match);
        this.updateResultFields(match.isOtherEvent as boolean);
        this.savedMatch = Object.freeze(Object.assign({}, match));
      })
    );

    this.otherMatchEvents = this.matchService.getOtherEventListForMatch();
  }

  get assignedLocationControl() {
    return this.form.controls.assignedLocationId;
  }

  get assignedTeamControl() {
    return this.form.controls.assignedTeamId;
  }

  get assignedTeamCategoriesControl() {
    return this.form.controls.assignedCategoryIds;
  }

  get assignedArticlesControl() {
    return this.form.controls.assignedArticleIds;
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.matchService.save(this.form.value as Match).then(() => {
      if (withBack) {
        this.redirectToList();
      }
    });
  }

  cancel() {
    this.redirectToList();
  }

  redirectToList() {
    this.router.navigate(['/matches/list']).then();
  }

  deleteMatch(item: Match): void {
    this.firestoreService.removeItem('matches', item, 'match', '/matches/list');
  }

  reset(): void {
    this.form.patchValue(this.savedMatch);
  }

  updateControl(path: string, value: string) {
    const control = this.form.controls[path];
    control.setValue(value);
    control.markAsDirty();
  }

  toggleOtherEventInput($event: MatCheckboxChange) {
    this.updateResultFields($event.checked);
  }

  updateResultFields(isOtherEvent: boolean) {
    if (isOtherEvent) {
      this.form.get('result.homeTeamGoals')?.disable();
      this.form.get('result.guestTeamGoals')?.disable();
      this.form.get('result.otherEvent')?.enable();
    } else {
      this.form.get('result.otherEvent')?.disable();
      this.form.get('result.homeTeamGoals')?.enable();
      this.form.get('result.guestTeamGoals')?.enable();
    }
  }

}
