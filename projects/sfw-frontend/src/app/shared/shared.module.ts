import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DisplayFirstMediaPipe } from '@shared/pipes/display-first-media.pipe';
import { StripHtmlPipe } from '@shared/pipes/strip-html.pipe';
import { TruncateTextPipe } from '@shared/pipes/truncate-text.pipe';
import { ArticleModule } from './module/article/article.module';
import { LinkByCategoryTitlePipe } from './pipes/link-by-category-title.pipe';
import { SlugPipe } from './pipes/slug.pipe';

@NgModule({
  declarations: [
    DisplayFirstMediaPipe,
    LinkByCategoryTitlePipe,
    SlugPipe,
    StripHtmlPipe,
    TruncateTextPipe
  ],
  exports: [
    ArticleModule,
    // Pipes
    DisplayFirstMediaPipe,
    LinkByCategoryTitlePipe,
    SlugPipe,
    StripHtmlPipe,
    TruncateTextPipe
  ],
  imports: [
    ArticleModule,
    CommonModule
  ]
})
export class SharedModule { }
