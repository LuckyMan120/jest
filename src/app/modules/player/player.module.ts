import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { WidgetModule } from '../../shared/modules/widgets/widget.module';
import { SharedModule } from '../../shared/shared.module';
import { CalendarService } from './../calendar/calendar.service';
import { CategoryService } from './../category/category.service';
import { TeamService } from './../team/team.service';
import { PlayerDashboardComponent } from './player-dashboard/player-dashboard.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { PlayerFormComponent } from './player-form/player-form.component';
import { PlayerTeamMgmtFormComponent } from './player-form/player-team-mgmt/player-team-mgmt-form/player-team-mgmt-form.component';
import { PlayerTeamMgmtListComponent } from './player-form/player-team-mgmt/player-team-mgmt-list/player-team-mgmt-list.component';
import { PlayerTeamMgmtComponent } from './player-form/player-team-mgmt/player-team-mgmt.component';
import { PlayerTeamFormComponent } from './player-form/player-team/player-team-form/player-team-form.component';
import { PlayerTeamListComponent } from './player-form/player-team/player-team-list/player-team-list.component';
import { PlayerTeamComponent } from './player-form/player-team/player-team.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerStatisticsComponent } from './player-statistics/player-statistics.component';
import { PlayerService } from './player.service';
import { PlayersComponent } from './players/players.component';

@NgModule({
  declarations: [
    PlayersComponent,
    PlayerListComponent,
    PlayerFormComponent,
    PlayerDetailComponent,
    PlayerDashboardComponent,
    PlayerStatisticsComponent,
    PlayerTeamMgmtComponent,
    PlayerTeamMgmtListComponent,
    PlayerTeamMgmtFormComponent,
    PlayerTeamComponent,
    PlayerTeamListComponent,
    PlayerTeamFormComponent
  ],
  imports: [
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    PlayerRoutingModule,
    SharedModule,

    WidgetModule
  ],
  providers: [
    CalendarService,
    CategoryService,
    PlayerService,
    TeamService
  ]
})
export class PlayerModule { }
