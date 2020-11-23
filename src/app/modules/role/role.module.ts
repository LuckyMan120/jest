import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PermissionService } from '../permission/permission.service';
import { SharedModule } from './../../shared/shared.module';
import { RoleFormComponent } from './role-form/role-form.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleRoutingModule } from './role-routing.module';
import { RoleService } from './role.service';

@NgModule({
  declarations: [
    RoleListComponent,
    RoleFormComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    BsDropdownModule,
    RoleRoutingModule,
    SharedModule
  ],
  providers: [
    PermissionService,
    RoleService
  ]
})
export class RoleModule { }
