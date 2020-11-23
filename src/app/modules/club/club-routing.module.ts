import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './../../shared/guards/auth.guard';
import { ClubFormComponent } from './club-form/club-form.component';

export const clubRoutes: Routes = [
  {
    path: 'info',
    component: ClubFormComponent
  },
  {
    path: 'honoraries',
    loadChildren: () => import('./club-honoraries/club-honorary.module').then(m => m.ClubHonoraryModule),
    canActivate: [AuthGuard],
    data: { permissions: ['verein-ehrenmitglieder'] },
  },
  {
    path: 'management',
    loadChildren: () => import('./club-management/club-management.module').then(m => m.ClubManagementModule),
    canActivate: [AuthGuard],
    data: { permissions: ['verein-vorstand'] },
  },
  {
    path: 'timeline',
    loadChildren: () => import('../../shared/modules/timeline/timeline.module').then(m => m.TimelineModule),
    canActivate: [AuthGuard],
    data: { permissions: ['verein-zeitleiste'] },
  },
  {
    path: '**',
    redirectTo: 'info'
  }
];

@NgModule({
  imports: [RouterModule.forChild(clubRoutes)],
  exports: [RouterModule]
})
export class ClubRoutingModule {
}
