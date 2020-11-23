import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { WysiwygModule } from './../../shared/modules/wysiwyg/wysiwyg.module';
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubRoutingModule } from './club-routing.module';
import { ClubService } from './club.service';


@NgModule({
  declarations: [
    ClubFormComponent
  ],
  imports: [
    ClubRoutingModule,
    MatSelectModule,
    SharedModule,
    WysiwygModule
  ],
  providers: [
    ClubService
  ]
})
export class ClubModule { }
