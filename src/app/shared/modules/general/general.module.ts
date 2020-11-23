import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { NoticeComponent } from './notice/notice.component';

@NgModule({
  declarations: [
    ErrorComponent,
    NoticeComponent
  ],
  exports: [
    ErrorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class GeneralModule {
}
