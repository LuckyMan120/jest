import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchDashboardComponent } from './match-dashboard/match-dashboard.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { MatchEventFormComponent } from './match-form/match-events/match-event-form/match-event-form.component';
import { MatchEventsComponent } from './match-form/match-events/match-events.component';
import { MatchFormComponent } from './match-form/match-form.component';
import { MatchListComponent } from './match-list/match-list.component';
import { MatchesComponent } from './matches/matches.component';

export const matchRoutes: Routes = [
  {
    path: '',
    component: MatchesComponent,
    children: [
      {
        path: 'dashboard',
        component: MatchDashboardComponent
      },
      {
        path: 'list',
        component: MatchListComponent
      },
      {
        path: 'detail/:matchId',
        component: MatchDetailComponent
      },
      {
        path: 'create',
        component: MatchFormComponent
      },
      {
        path: 'edit/:matchId',
        component: MatchFormComponent,
        children: [
          {
            path: '',
            component: MatchEventsComponent
          },
          {
            path: 'event/:eventId',
            component: MatchEventFormComponent
          },
          {
            path: '**',
            redirectTo: ''
          }
        ]
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(matchRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MatchRoutingModule {
}
