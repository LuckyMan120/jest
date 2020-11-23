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
import { ClubService } from '../club/club.service';
import { BirthdayModule } from './../../shared/modules/birthday/birthday.module';
import { CalendarService } from './../calendar/calendar.service';
import { CategoryService } from './../category/category.service';
import { ClubHonorariesService } from './../club/club-honoraries/club-honoraries.service';
import { ClubManagementService } from './../club/club-management/club-management.service';
import { TeamService } from './../team/team.service';
import { MemberDashboardComponent } from './member-dashboard/member-dashboard.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { MemberClubMgmtFormComponent } from './member-form/member-club-mgmt/member-club-mgmt-form/member-club-mgmt-form.component';
import { MemberClubMgmtListComponent } from './member-form/member-club-mgmt/member-club-mgmt-list/member-club-mgmt-list.component';
import { MemberClubMgmtComponent } from './member-form/member-club-mgmt/member-club-mgmt.component';
import { MemberFormComponent } from './member-form/member-form.component';
import { MemberTeamMgmtFormComponent } from './member-form/member-team-mgmt/member-team-mgmt-form/member-team-mgmt-form.component';
import { MemberTeamMgmtListComponent } from './member-form/member-team-mgmt/member-team-mgmt-list/member-team-mgmt-list.component';
import { MemberTeamMgmtComponent } from './member-form/member-team-mgmt/member-team-mgmt.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberStatisticsComponent } from './member-statistics/member-statistics.component';
import { memberRoutes } from './member.routing';
import { MemberService } from './member.service';
import { MembersComponent } from './members/members.component';

@NgModule({
  declarations: [
    MemberDashboardComponent,
    MemberListComponent,
    MemberFormComponent,
    MembersComponent,
    MemberDetailComponent,
    MemberClubMgmtFormComponent,
    MemberTeamMgmtFormComponent,
    MemberClubMgmtListComponent,
    MemberClubMgmtComponent,
    MemberTeamMgmtComponent,
    MemberTeamMgmtListComponent,
    MemberStatisticsComponent,
  ],
  imports: [
    BirthdayModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    RouterModule.forChild(memberRoutes),
    SharedModule,

    WidgetModule
  ],
  providers: [
    CalendarService,
    CategoryService,
    ClubHonorariesService,
    ClubManagementService,
    ClubService,
    MemberService,
    TeamService
  ]
})
export class MemberModule { }
