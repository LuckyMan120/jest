import { Routes } from '@angular/router';
import { ArticleDashboardComponent } from './article-dashboard/article-dashboard.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleFormComponent } from './article-form/article-form.component';
import { ArticleListComponent } from './article-list/article-list.component';

export const articleRoutes: Routes = [
  {
    path: 'dashboard',
    component: ArticleDashboardComponent
  },
  {
    path: 'list',
    component: ArticleListComponent,
  },
  {
    path: 'detail/:articleId',
    component: ArticleDetailComponent,
  },
  {
    path: 'create',
    component: ArticleFormComponent
  },
  {
    path: 'edit/:articleId',
    component: ArticleFormComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
