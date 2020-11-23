import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { WidgetModule } from '../../shared/modules/widgets/widget.module';
import { SharedModule } from '../../shared/shared.module';
import { BirthdayModule } from './../../shared/modules/birthday/birthday.module';
import { SeniorDashboardComponent } from './senior-dashboard/senior-dashboard.component';
import { SeniorDetailComponent } from './senior-detail/senior-detail.component';
import { SeniorFormComponent } from './senior-form/senior-form.component';
import { SeniorListComponent } from './senior-list/senior-list.component';
import { SeniorStatisticsComponent } from './senior-statistics/senior-statistics.component';
import { seniorRoutes } from './senior.routing';
import { SeniorService } from './senior.service';
import { SeniorsComponent } from './seniors/seniors.component';

@NgModule({
  declarations: [
    SeniorsComponent,
    SeniorDashboardComponent,
    SeniorDetailComponent,
    SeniorFormComponent,
    SeniorListComponent,
    SeniorStatisticsComponent,
  ],
  imports: [
    BirthdayModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    RouterModule.forChild(seniorRoutes),
    SharedModule,

    WidgetModule
  ],
  providers: [
    SeniorService
  ]
})
export class SeniorModule { }
