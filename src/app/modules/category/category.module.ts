import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { WysiwygModule } from './../../shared/modules/wysiwyg/wysiwyg.module';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { categoryRoutes } from './category-routing.module';
import { CategoryService } from './category.service';


@NgModule({
  imports: [
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    SharedModule,
    RouterModule.forChild(categoryRoutes),
    WysiwygModule
  ],
  declarations: [
    CategoriesComponent,
    CategoryListComponent,
    CategoryFormComponent,
    CategoryDetailComponent
  ],
  providers: [
    CategoryService
  ]
})

export class CategoryModule {
}
