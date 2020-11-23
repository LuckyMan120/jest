import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from './../../shared/shared.module';
import { PermissionFormComponent } from './permission-form/permission-form.component';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionRoutingModule } from './permission-routing.module';
import { PermissionService } from './permission.service';
import { PermissionsComponent } from './permissions/permissions.component';

@NgModule({
  declarations: [
    PermissionsComponent,
    PermissionListComponent,
    PermissionFormComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    BsDropdownModule,
    PermissionRoutingModule,
    SharedModule
  ],
  providers: [
    PermissionService
  ]
})
export class PermissionModule { }
