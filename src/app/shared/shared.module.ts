import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgPipesModule } from 'ngx-pipes';
import { AuthService } from './../views/pages/auth/auth.service';
import { AutocompleteModule } from './modules/autocomplete/autocomplete.module';
import { CreationPublicationModule } from './modules/creation-publication/creation-publication.module';
import { CrudModule } from './modules/crud/crud.module';
import { MediaModule } from './modules/media/media.module';
import { PortletModule } from './modules/portlet/portlet.module';
import { SafePipe } from './pipes/safe.pipe';
import { StripHtmlPipe } from './pipes/strip-html.pipe';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';


@NgModule({
  declarations: [
    TruncateTextPipe,
    StripHtmlPipe,
    SafePipe
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
  ],
  exports: [
    AutocompleteModule,
    BsDropdownModule,
    CommonModule,
    CreationPublicationModule,
    CrudModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDatetimeModule,
    MediaModule,
    NgPipesModule,
    PortletModule,
    ReactiveFormsModule,
    SafePipe,
    StripHtmlPipe,
    TabsModule,
    TruncateTextPipe,
    TooltipModule
  ],
  providers: [
    AuthService
  ]
})
export class SharedModule {
}
