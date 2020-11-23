import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubHonorariesComponent } from './club-honoraries/club-honoraries.component';
import { ClubHonoraryFormComponent } from './club-honorary-form/club-honorary-form.component';
import { ClubHonoraryListComponent } from './club-honorary-list/club-honorary-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClubHonorariesComponent,
    children: [
      {
        path: 'list',
        component: ClubHonoraryListComponent
      },
      {
        path: 'edit/:honoraryId',
        component: ClubHonoraryFormComponent
      },
      {
        path: 'create',
        component: ClubHonoraryFormComponent
      },
      {
        path: '**',
        redirectTo: 'list'
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
export class ClubHonoraryRoutingModule {
}
