import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { WidgetModule } from './../../shared/modules/widgets/widget.module';
import { MatchDashboardComponent } from './match-dashboard/match-dashboard.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { MatchEventFormComponent } from './match-form/match-events/match-event-form/match-event-form.component';
import { MatchEventsComponent } from './match-form/match-events/match-events.component';
import { MatchFormComponent } from './match-form/match-form.component';
import { MatchFormationComponent } from './match-formation/match-formation.component';
import { MatchInfoLeftComponent } from './match-info/match-info-left/match-info-left.component';
import { MatchInfoRightComponent } from './match-info/match-info-right/match-info-right.component';
import { MatchInfoComponent } from './match-info/match-info.component';
import { MatchListComponent } from './match-list/match-list.component';
import { MatchRoutingModule } from './match-routing.module';
import { MatchService } from './match.service';
import { MatchesComponent } from './matches/matches.component';
import { MissingMatchResultsComponent } from './missing-match-results/missing-match-results.component';
import { BenchAndStartingElevenFilterPipe } from './_pipes/bench-and-starting-eleven-filter.pipe';


@NgModule({
  declarations: [
    MatchesComponent,
    MatchListComponent,
    MatchFormComponent,
    MatchDashboardComponent,
    MatchDetailComponent,
    MatchEventFormComponent,
    MatchEventsComponent,
    MatchInfoComponent,
    MatchInfoLeftComponent,
    MatchInfoRightComponent,
    MissingMatchResultsComponent,
    MatchFormationComponent,
    BenchAndStartingElevenFilterPipe
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatchRoutingModule,
    SharedModule,

    MatSelectModule,
    WidgetModule
  ],
  providers: [
    MatchService
  ]
})
export class MatchModule {
}
