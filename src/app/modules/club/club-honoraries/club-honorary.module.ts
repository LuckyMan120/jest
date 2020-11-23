import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AutocompleteModule } from '../../../shared/modules/autocomplete/autocomplete.module';
import { SharedModule } from '../../../shared/shared.module';
import { } from './../../../shared/shared.module';
import { ClubHonorariesService } from './club-honoraries.service';
import { ClubHonorariesComponent } from './club-honoraries/club-honoraries.component';
import { ClubHonoraryFormComponent } from './club-honorary-form/club-honorary-form.component';
import { ClubHonoraryListComponent } from './club-honorary-list/club-honorary-list.component';
import { ClubHonoraryRoutingModule } from './club-honorary-routing.module';


@NgModule({
  declarations: [
    ClubHonorariesComponent,
    ClubHonoraryListComponent,
    ClubHonoraryFormComponent
  ],
  imports: [
    AutocompleteModule,
    CommonModule,
    ClubHonoraryRoutingModule,
    TooltipModule,
    SharedModule,

  ],
  providers: [
    ClubHonorariesService
  ]
})
export class ClubHonoraryModule {
}
