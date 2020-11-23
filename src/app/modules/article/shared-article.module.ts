import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LatestArticleComponent } from './latest-article/latest-article.component';
import { TopArticlesComponent } from './top-articles/top-articles.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    LatestArticleComponent,
    TopArticlesComponent
  ],
  exports: [
    LatestArticleComponent,
    TopArticlesComponent
  ]
})

export class SharedArticleModule {
}
