import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../views/pages/auth/auth.service';
import { FirestoreService } from './../../shared/services/firestore.service';
import { Category } from './_interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) {
  }

  public get(id: string): Observable<Category | undefined> {
    return !!!id ? this.initNewCategory() : this.loadCategory(id);
  }

  private loadCategory(id: string): Observable<Category | undefined> {
    return this.firestoreService.doc$<Category>(`categories/${id}`).pipe(
      map(category => {
        if (category) {
          return {
            ...category,
            creation: this.firestoreService.getCreation(category),
            publication: this.firestoreService.getPublication(category),
            modification: this.firestoreService.getModification(category)
          };
        }
      })
    );
  }

  private initNewCategory(): Observable<Category> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          title: '',
          description: '',
          isImported: false,
          isCoreCategory: true,
          galleries: null,
          creation: this.firestoreService.getCreation({}, user),
          publication: this.firestoreService.getPublication({}, user),
          modification: this.firestoreService.getModification({}, { by: user, change: 'NEW' })
        };
      })
    );
  }

  public getFormFields(): FormGroup {
    return this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      assignedCategoryIds: [],
      description: null,
      parsingValues: null,
      creation: this.firestoreService.initCreationFormGroup(),
      publication: this.firestoreService.initPublicationFormGroup(),
      modification: this.firestoreService.initModificationFormArray(),
      isImported: null,
      id: null,
      isCoreCategory: null
    });
  }

  public async save(category: Category): Promise<string> {
    return this.firestoreService.save(category, 'categories', 'category');
  }

  getCategoryListByParentCategory(categoryString: string): Observable<Category[]> {
    return this.firestoreService.col$<Category>(`categories`, (ref: Query) => ref.where('parsingValues', '==', categoryString)).pipe(
      switchMap((mainCategories: Category[]) => {
        if (mainCategories.length === 0) {
          return [];
        }
        return this.firestoreService.col$<Category>(`categories`, (ref: Query) => {
          return ref.where('assignedCategoryIds', 'array-contains', mainCategories[0].id);
        });
      })
    );
  }

  getCategoryListByParentCategoryTitle(title: string): Observable<Category[]> {
    return this.firestoreService.col$<Category>(`categories`, (ref: Query) => {
      ref = ref.where('assignedCategoryTitles', 'array-contains', title);
      return ref.orderBy('title');
    });
  }

}
