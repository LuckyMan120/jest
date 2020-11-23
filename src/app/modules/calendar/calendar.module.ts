import { NgModule } from '@angular/core';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from '../../shared/shared.module';
import { WysiwygModule } from './../../shared/modules/wysiwyg/wysiwyg.module';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventInfoComponent } from './event-info/event-info.component';

@NgModule({
  declarations: [
    CalendarComponent,
    EventInfoComponent,
    EventFormComponent
  ],
  imports: [
    AngularFireFunctionsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    CalendarRoutingModule,
    SharedModule,
    FullCalendarModule,
    MatSelectModule,
    WysiwygModule
  ]
})
export class CalendarModule {
}
