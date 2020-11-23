import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../../shared/shared.module';
import { ClubManagementFormComponent } from './club-management-form/club-management-form.component';
import { ClubManagementListComponent } from './club-management-list/club-management-list.component';
import { ClubManagementRoutingModule } from './club-management-routing.module';
import { ClubManagementService } from './club-management.service';
import { ClubManagementComponent } from './club-management/club-management.component';
import { ClubPositionTableComponent } from './club-position-table/club-position-table.component';

@NgModule({
  declarations: [
    ClubManagementComponent,
    ClubManagementListComponent,
    ClubManagementFormComponent,
    ClubPositionTableComponent
  ],
  imports: [
    ClubManagementRoutingModule,
    MatExpansionModule,
    MatSelectModule,
    SharedModule,

  ],
  providers: [
    ClubManagementService
  ]
})
export class ClubManagementModule {
}
