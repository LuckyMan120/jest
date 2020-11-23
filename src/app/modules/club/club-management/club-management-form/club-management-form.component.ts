import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Category } from '../../../category/_interfaces/category.interface';
import { ClubManagement } from '../../_interfaces/club-management.interface';
import { ClubManagementService } from '../club-management.service';
import { CategoryService } from './../../../category/category.service';

@Component({
  selector: 'app-club-management-form',
  templateUrl: './club-management-form.component.html',
  styleUrls: ['./club-management-form.component.scss']
})
export class ClubManagementFormComponent implements OnInit {

  form!: FormGroup;

  categories$!: Observable<Category[]>;
  managementPosition$!: Observable<ClubManagement>;

  savedManagement!: ClubManagement;
  hasFormErrors = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clubMangementService: ClubManagementService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    this.form = this.clubMangementService.getFormFields();

    this.managementPosition$ = this.route.params.pipe(
      switchMap(params => this.clubMangementService.get(params.managementId)),
      tap((management: ClubManagement) => {
        this.form.patchValue(management);
        this.savedManagement = Object.freeze(Object.assign({}, management));
      })
    );

    this.categories$ = this.categoryService.getCategoryListByParentCategoryTitle('Vereinsführung');
  }

  public get assignedMemberControl() {
    return this.form.controls.assignedMemberId;
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.clubMangementService.save(this.form.getRawValue() as ClubManagement).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  redirectToList(): Promise<boolean> {
    return this.router.navigate(['/club/management/list']);
  }

}
