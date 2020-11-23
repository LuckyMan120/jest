import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';

export const categoryRoutes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: '',
        component: CategoryListComponent
      },
      {
        path: 'detail/:categoryId',
        component: CategoryDetailComponent
      },
      {
        path: 'create',
        component: CategoryFormComponent
      },
      {
        path: 'edit/:categoryId',
        component: CategoryFormComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
