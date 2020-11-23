import { Routes } from '@angular/router';
import { MemberDashboardComponent } from './member-dashboard/member-dashboard.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { MemberFormComponent } from './member-form/member-form.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MembersComponent } from './members/members.component';

export const memberRoutes: Routes = [
  {
    path: '',
    component: MembersComponent,
    children: [
      {
        path: 'dashboard',
        component: MemberDashboardComponent
      },
      {
        path: 'list',
        component: MemberListComponent
      },
      {
        path: 'create',
        component: MemberFormComponent
      },
      {
        path: 'detail/:memberId',
        component: MemberDetailComponent
      },
      {
        path: 'edit/:memberId',
        component: MemberFormComponent
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
