import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StartComponent } from './start/start.component';

export const startRoutes: Routes = [
  {
    path: '',
    component: StartComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }

];
