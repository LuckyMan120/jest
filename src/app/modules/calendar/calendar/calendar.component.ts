import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Calendar } from '@application/_interfaces/calendar.interface';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, tap } from 'rxjs/operators';
import { Application } from '../../settings/_interfaces/application.interface';
import { LayoutUtilsService } from './../../../shared/services/layout-utils.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { ApplicationService } from './../../settings/application.service';
import { CalendarService } from './../calendar.service';
import { CalEvent } from './../_interfaces/cal-event.interface';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('calendar', { static: false }) calendar!: FullCalendarComponent;
  assignedCalendarsControl = new FormControl();

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth, timeGridWeek, timeGridDay'
    },
    plugins: [dayGridPlugin, timeGrigPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: deLocale,
    editable: true,
    droppable: false,
    weekNumbers: true,
    themeSystem: 'bootstrap',
    dateClick: this.handleDateClick.bind(this),
    // select: this.updateView.bind(this),
    eventClick: this.showEventInfo.bind(this),
    datesSet: this.updateView.bind(this)
  };

  application$!: Observable<Application | undefined>;
  application!: Application;
  sub!: Subscription;
  displayedCalendars!: string[];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  timeMin!: Date;
  timeMax!: Date;

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private applicationService: ApplicationService,
    private calendarService: CalendarService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.application$ = this.applicationService.getCurrentApplication().pipe(
      tap((application: Application | undefined) => {
        if (application) {
          this.assignedCalendarsControl.patchValue(
            application?.assignedCalendars?.filter(cal => cal.isActive).map(calendar => calendar.calendarId)
          );
          this.application = application;
        }
      })
    );
  }

  ngAfterViewChecked() {
    this.sub = this.assignedCalendarsControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((changes: string[]) => {
      if (changes !== this.displayedCalendars) {
        this.displayedCalendars = changes;
        this.requestCalendarWithOptions();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getCalendar() {
    return this.calendar.getApi();
  }

  requestCalendarWithOptions(): void | Promise<any> {
    this.isLoading$.next(true);

    if (!this.displayedCalendars || this.displayedCalendars.length === 0) {
      this.isLoading$.next(false);
      return this.notificationService.showNotification(`notifications.calendarEvents.chooseCalendars`, 'danger');
    }

    const options: Calendar[] = this.displayedCalendars.map(cal => {
      const filteredCal = this.application.assignedCalendars?.find(calendar => calendar.calendarId === cal) as Calendar;
      return {
        ...filteredCal,
        singleEvents: true,
        timeMin: (this.getCalendar().view.activeStart).toISOString(),
        timeMax: (this.getCalendar().view.activeEnd).toISOString(),
        maxResults: 2500
      };
    });

    return this.calendarService.getGoogleCalendarEvents(options)
      .then((events: any[]) => this.generateCalendarView(events))
      .finally(() => this.isLoading$.next(false));
  }

  generateCalendarView(events: any[]) {
    this.getCalendar().removeAllEventSources();
    const eventSource = events.map(event => {
      const dates = this.calendarService.generateCalendarDate(event);
      return {
        ...dates,
        id: event.id,
        title: event.summary,
        location: event.location,
        description: event.description,
        calendarId: event.organizer.email,
        classNames: event.classNames
      };
    });
    this.getCalendar().addEventSource(eventSource);
    this.getCalendar().render();
  }

  changeView($event: any): void {
    console.log($event);
  }

  updateView(): void {
    if (this.calendar && this.displayedCalendars) {
      this.requestCalendarWithOptions();
    }
  }

  handleDateClick(model: any): void {
    console.log(model);
  }

  showEventInfo(info: { event: any, el: any, jsEvent: any, view: any }) {
    console.log(info);
    const dialogRef = this.layoutUtilsService.showEventInfo(info);
    dialogRef.afterClosed().pipe(take(1)).subscribe((eventToDelete) => {
      if (eventToDelete) {
        this.calendarService.deleteCalendarEvent(eventToDelete);
        this.requestCalendarWithOptions();
      }
    });
  }

  createEvent() {
    const dialogRef = this.layoutUtilsService.showEventForm({ event: {} });
    dialogRef.afterClosed().pipe(take(1)).subscribe((event: CalEvent) => {
      if (event) {
        delete (event.allDayEvent);
        this.calendarService.createGoogleCalendarEvent({
          ...event,
          start: event.allDayEvent ? { date: event.start.toISOString().slice(0, 10) } : { dateTime: event.start },
          end: event.allDayEvent ? { date: event.end.toISOString().slice(0, 10) } : { dateTime: event.end }
        }).then(() => this.requestCalendarWithOptions());
      }
    });
  }

}
