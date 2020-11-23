import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubManagementFormComponent } from './club-management-form/club-management-form.component';
import { ClubManagementListComponent } from './club-management-list/club-management-list.component';
import { ClubManagementComponent } from './club-management/club-management.component';

const routes: Routes = [
  {
    path: '',
    component: ClubManagementComponent,
    children: [
      {
        path: 'list',
        component: ClubManagementListComponent
      },
      {
        path: 'edit/:managementId',
        component: ClubManagementFormComponent
      },
      {
        path: 'create',
        component: ClubManagementFormComponent
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
export class ClubManagementRoutingModule { }
