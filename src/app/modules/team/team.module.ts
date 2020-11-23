import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { WidgetModule } from '../../shared/modules/widgets/widget.module';
import { SharedModule } from '../../shared/shared.module';
import { CategoryService } from '../category/category.service';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';
import { StandingsComponent } from './team-detail/standings/standings.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamAssignedContentComponent } from './team-form/team-assigned-content/team-assigned-content.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamPositionsFormComponent } from './team-form/team-positions-form/team-positions-form.component';
import { TeamTrainingFormComponent } from './team-form/team-training-form/team-training-form.component';
import { TeamListComponent } from './team-list/team-list.component';
import { teamRoutes } from './team.routing';
import { TeamService } from './team.service';
import { TeamsComponent } from './teams/teams.component';


@NgModule({
  declarations: [
    TeamsComponent,
    TeamFormComponent,
    TeamListComponent,
    TeamDashboardComponent,
    TeamDetailComponent,
    TeamPositionsFormComponent,
    TeamTrainingFormComponent,
    TeamAssignedContentComponent,
    StandingsComponent
  ],
  imports: [
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    RouterModule.forChild(teamRoutes),
    SharedModule,
    WidgetModule
  ],
  providers: [
    CategoryService,
    TeamService
  ]
})
export class TeamModule {
}
