import {
  MatColorFormats, MAT_COLOR_FORMATS,
  NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS
} from '@angular-material-components/color-picker';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SetupRoutingModule } from './setup-routing.module';
import { FirstStepComponent } from './start/first-step/first-step.component';
import { SecondStepComponent } from './start/second-step/second-step.component';
import { StartComponent } from './start/start.component';

export const CUSTOM_MAT_COLOR_FORMATS: MatColorFormats = {
  display: {
    colorInput: 'hex'
  }
};

@NgModule({
  declarations: [
    StartComponent,
    FirstStepComponent,
    SecondStepComponent
  ],
  imports: [
    AngularFireFunctionsModule,
    CommonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    NgxMatColorPickerModule,
    ReactiveFormsModule,
    SetupRoutingModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ]
})
export class SetupModule { }
