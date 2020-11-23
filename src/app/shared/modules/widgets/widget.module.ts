import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from './../../../shared/core.module';
import { ChartComponent } from './chart/chart.component';
import { Widget4Component } from './widget4/widget4.component';

@NgModule({
  declarations: [
    ChartComponent,
    Widget4Component
  ],
  exports: [
    ChartComponent,
    Widget4Component
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ]
})
export class WidgetModule {
}
