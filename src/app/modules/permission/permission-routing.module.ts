import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionFormComponent } from './permission-form/permission-form.component';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionsComponent } from './permissions/permissions.component';


const routes: Routes = [
  {
    path: '',
    component: PermissionsComponent,
    children: [
      {
        path: 'list',
        component: PermissionListComponent
      },
      {
        path: 'create',
        component: PermissionFormComponent
      },
      {
        path: 'edit/:permissionId',
        component: PermissionFormComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'list'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
