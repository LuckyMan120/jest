import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';

export const calendarRoutes: Routes = [
  {
    path: '',
    component: CalendarComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(calendarRoutes)
  ]
})
export class CalendarRoutingModule {
}
