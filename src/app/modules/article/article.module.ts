import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreModule } from '../../shared/core.module';
import { WidgetModule } from '../../shared/modules/widgets/widget.module';
import { SharedModule } from '../../shared/shared.module';
import { WysiwygModule } from './../../shared/modules/wysiwyg/wysiwyg.module';
import { LayoutUtilsService } from './../../shared/services/layout-utils.service';
import { CategoryService } from './../category/category.service';
import { ArticleDashboardComponent } from './article-dashboard/article-dashboard.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleFormComponent } from './article-form/article-form.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleQuickPanelComponent } from './article-quick-panel/article-quick-panel.component';
import { articleRoutes } from './article-routing.module';
import { ArticleService } from './article.service';
import { SharedArticleModule } from './shared-article.module';

@NgModule({
  imports: [
    CoreModule,
    InlineSVGModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDialogModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    PerfectScrollbarModule,
    RouterModule.forChild(articleRoutes),
    SharedModule,
    SharedArticleModule,
    WidgetModule,
    WysiwygModule
  ],
  declarations: [
    ArticleQuickPanelComponent,
    ArticleDashboardComponent,
    ArticleListComponent,
    ArticleDetailComponent,
    ArticleFormComponent
  ],
  providers: [
    ArticleService,
    CategoryService,
    LayoutUtilsService
  ]
})

export class ArticleModule {
}
