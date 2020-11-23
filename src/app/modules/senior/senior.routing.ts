import { Routes } from '@angular/router';
import { SeniorDashboardComponent } from './senior-dashboard/senior-dashboard.component';
import { SeniorDetailComponent } from './senior-detail/senior-detail.component';
import { SeniorFormComponent } from './senior-form/senior-form.component';
import { SeniorListComponent } from './senior-list/senior-list.component';
import { SeniorsComponent } from './seniors/seniors.component';

export const seniorRoutes: Routes = [
  {
    path: '',
    component: SeniorsComponent,
    children: [
      {
        path: 'dashboard',
        component: SeniorDashboardComponent
      },
      {
        path: 'list',
        component: SeniorListComponent
      },
      {
        path: 'create',
        component: SeniorFormComponent
      },
      {
        path: 'detail/:seniorId',
        component: SeniorDetailComponent
      },
      {
        path: 'edit/:seniorId',
        component: SeniorFormComponent
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
