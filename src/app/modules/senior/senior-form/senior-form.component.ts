import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Category } from '../../category/_interfaces/category.interface';
import { ClubHonorary } from '../../club/_interfaces/club-honorary.interface';
import { Player } from '../../player/_interfaces/player.interface';
import { SeniorService } from '../senior.service';
import { CategoryService } from './../../category/category.service';
import { Senior } from './../_interfaces/senior.interface';

@Component({

  selector: 'app-senior-form',
  templateUrl: './senior-form.component.html',
  styleUrls: ['./senior-form.component.scss']
})
export class SeniorFormComponent implements OnInit {

  senior$!: Observable<Senior>;
  filteredPlayers$!: Observable<Player[]>;
  filteredSeniors$!: Observable<Senior[]>;
  honorary$!: Observable<ClubHonorary>;

  form!: FormGroup;
  savedSenior!: Senior;

  ahMemberStates$!: Observable<Category[]>;
  hasFormErrors = false;

  constructor(
    private seniorService: SeniorService,
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private categoryService: CategoryService
  ) {
  }

  get assignedMemberControl() {
    return this.form.controls.assignedMemberId;
  }

  get assignedPlayerControl() {
    return this.form.controls.assignedPlayerId;
  }

  ngOnInit() {
    this.form = this.seniorService.getSeniorFormFields();

    this.senior$ = this.route.params.pipe(
      switchMap(params => this.seniorService.get(params.seniorId)),
      tap((senior: Senior) => {

        this.form.patchValue(senior);

        if (senior.id) {
          this.form.get('firstName')?.disable();
          this.form.get('lastName')?.disable();
          this.form.get('birthDate')?.disable();

          if (senior.isImported) {
            this.form.get('creation')?.disable();
          }
        }

        this.savedSenior = Object.freeze(Object.assign({}, senior));
      })
    );

    this.ahMemberStates$ = this.categoryService.getCategoryListByParentCategoryTitle('AH-Mitglieder');
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.seniorService.save(this.form.getRawValue() as Senior).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  cancel() {
    return this.redirectToList();
  }

  redirectToList() {
    return this.router.navigate(['/seniors/list']);
  }

  deleteSenior(item: Senior): void {
    return this.firestoreService.removeItem('seniors', item, 'senior', '/seniors/list');
  }

  reset(): void {
    this.form.patchValue(this.savedSenior);
  }

  updateControl(path: any, value: any) {
    const control = this.form.controls[path];
    control.setValue(value);
    control.markAsDirty();
  }

}
