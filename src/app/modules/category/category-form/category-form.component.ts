import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { CategoryService } from '../category.service';
import { Category } from '../_interfaces/category.interface';

@Component({
  selector: 'app-category-form',
  templateUrl: 'category-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CategoryFormComponent implements OnInit {

  category$!: Observable<Category | undefined>;
  categories$!: Observable<Category[]>;

  selectedTab = 0;
  loading$: Observable<boolean> = new Observable<boolean>();
  hasFormErrors = false;

  savedCategory!: Category;
  form!: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    this.form = this.categoryService.getFormFields();

    this.category$ = this.route.params.pipe(
      switchMap(params => this.categoryService.get(params.categoryId)),
      tap((category: Category | undefined) => {
        if (category) {
          this.form.patchValue(category);

          if (!category.isCoreCategory) {
            this.form.disable();
            this.form.get('description')?.enable();
            this.form.get('publication')?.enable();
          }

          this.savedCategory = Object.freeze(Object.assign({}, category));
        }
      })
    );

    this.categories$ = this.firestoreService.col$('categories');
  }

  public get descriptionControl() {
    return this.form.controls.description;
  }

  reset() {
    this.form.patchValue(this.savedCategory);
  }

  onSubmit(withBack = false) {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }
    this.categoryService.save(this.form.value as Category).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  cancel() {
    return this.redirectToList();
  }

  redirectToList() {
    return this.router.navigate(['/categories']);
  }

  onAlertClose(): void {
    this.hasFormErrors = false;
  }

  deleteCategory(item: Category) {
    this.firestoreService.removeItem('categories', item, '/categories/list');
  }

}
