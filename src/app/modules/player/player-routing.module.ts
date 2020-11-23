import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerDashboardComponent } from './player-dashboard/player-dashboard.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { PlayerFormComponent } from './player-form/player-form.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayersComponent } from './players/players.component';

const routes: Routes = [
  {
    path: '',
    component: PlayersComponent,
    children: [
      {
        path: 'dashboard',
        component: PlayerDashboardComponent
      },
      {
        path: 'list',
        component: PlayerListComponent
      },
      {
        path: 'create',
        component: PlayerFormComponent
      },
      {
        path: 'edit/:playerId',
        component: PlayerFormComponent
      },
      {
        path: 'detail/:playerId',
        component: PlayerDetailComponent
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
