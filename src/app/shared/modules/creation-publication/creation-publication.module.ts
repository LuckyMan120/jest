import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { NgPipesModule } from 'ngx-pipes';
import { PortletModule } from '../portlet/portlet.module';
import { } from './../../shared.module';
import { CreationFormComponent } from './creation-form/creation-form.component';
import { CreationPublicationInfoComponent } from './creation-publication-info/creation-publication-info.component';
import { PublicationFormComponent } from './publication-form/publication-form.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgPipesModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    PortletModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  declarations: [
    CreationFormComponent,
    CreationPublicationInfoComponent,
    PublicationFormComponent
  ],
  exports: [
    CreationFormComponent,
    CreationPublicationInfoComponent,
    PublicationFormComponent
  ]
})
export class CreationPublicationModule {
}
