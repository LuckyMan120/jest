import { Routes } from '@angular/router';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamsComponent } from './teams/teams.component';

export const teamRoutes: Routes = [
  {
    path: '',
    component: TeamsComponent,
    children: [
      {
        path: 'dashboard',
        component: TeamDashboardComponent
      },
      {
        path: 'list',
        component: TeamListComponent
      },
      {
        path: 'create',
        component: TeamFormComponent
      },
      {
        path: 'detail/:teamId',
        component: TeamDetailComponent
      },
      {
        path: 'edit/:teamId',
        component: TeamFormComponent
      },
      {
        path: 'trainings',
        loadChildren: () => import('./training/training.module').then(m => m.TrainingModule)
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
