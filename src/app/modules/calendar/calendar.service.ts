import {
  DatePipe,
  FormatWidth,
  FormStyle,
  getLocaleDateFormat,
  getLocaleDayNames,
  getLocaleFirstDayOfWeek,
  getLocaleTimeFormat,
  TranslationWidth
} from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Calendar } from '@application/_interfaces/calendar.interface';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from './../../shared/services/notification.service';

@Injectable()
export class CalendarService {

  timezoneOffset = 0;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private fns: AngularFireFunctions,
    private notificationService: NotificationService,
    private afs: AngularFirestore
  ) {
    // this.timezoneOffset = new Date().getTimezoneOffset();
    // console.log(this.timezoneOffset);
  }

  public getLocaleDate(timestamp: number) {
    const date = new Date(timestamp);
    if (this.checkDate(date)) {
      const format = getLocaleDateFormat(this.locale, FormatWidth.Short);
      return new DatePipe(this.locale).transform(date, format);
    }
  }

  public getLocaleTime(timestamp: number): string | null {
    const date = new Date(timestamp);
    if (this.checkDate(date)) {
      const format = getLocaleTimeFormat(this.locale, FormatWidth.Short);
      return new DatePipe(this.locale).transform(date, format);
    } else {
      return null;
    }
  }

  private checkDate(date: Date): boolean {
    return date.getTime && !isNaN(date.getTime());
  }

  public getLocaleDay(day: number): string {
    const localeFirstDayOfWeek = getLocaleFirstDayOfWeek(this.locale);
    const localeDaysOfWeek = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide);

    const weekDays = [...localeDaysOfWeek];

    if (localeFirstDayOfWeek === 1) {
      weekDays.shift();
    }
    return weekDays[day];
  }

  public getLocaleWeek(): string[] {
    let weekDays: any = [];
    const localeFirstDayOfWeek = getLocaleFirstDayOfWeek(this.locale);
    const localeDaysOfWeek = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide);

    if (localeFirstDayOfWeek === 1) {
      weekDays = [...localeDaysOfWeek];
      weekDays.push(weekDays.shift());
    } else {
      weekDays = [...localeDaysOfWeek];
    }
    return weekDays;
  }

  public getTimeSlots(stepValue: number = 5, from?: Date, to?: Date): { slot: string, startTime: string }[] {
    const startDate = from ? from : new Date();
    startDate.setHours(16, 0, 0);

    const endDate = to ? to : new Date();
    endDate.setHours(21, 0, 0);

    const timeSlots = [];
    while (startDate <= endDate) {
      timeSlots.push({
        slot: `${startDate.getHours().toString().padStart(2, '0')}${startDate.getMinutes().toString().padStart(2, '0')}`,
        startTime: `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
      });
      startDate.setMinutes(startDate.getMinutes() + stepValue);
    }
    return timeSlots;
  }

  public async getGoogleCalendarEvents(options: Calendar[]): Promise<any> {

    const callable = this.fns.httpsCallable('callGetGoogleCalendarEvents');
    try {
      const result = await callable({ options }).toPromise();
      if (result) {
        if (result.errors) {
          return this.notificationService.showNotification(`notifications.calendarEvents.getError`, 'danger');
        } else {
          return result.map((event: any) => {

            if (event.start.date) {
              event.allDay = true;
            }

            const filteredCalendar = options.find(option => option.calendarId === event.organizer.email);
            event.BackgroundColor = filteredCalendar?.color;

            if (event.recurrence && event.recurrence.includes('RRULE:FREQ=YEARLY')) {
              event.start.date = event.start.date ? `${new Date().getFullYear()}-${event.start.date.substring(5, 11)}` : 'TODO';
            }

            return event;
          });
        }
      }
    } catch (err) {
      console.log(err);
      this.notificationService.showNotification(`notifications.calendarEvents.getError`, 'danger');
      return err;
    }
  }

  public generateCalendarDate(googleEvent: any) {
    let allDay = false;
    let when = googleEvent.start.dateTime;
    if (!when) {
      when = googleEvent.start.date;
    }
    let when2 = googleEvent.end.dateTime;
    if (!when2) {
      when2 = googleEvent.end.date;
    }

    const d1 = new Date(when);
    d1.setMinutes(d1.getMinutes() + this.timezoneOffset);

    const d2 = new Date(when2);
    d2.setMinutes(d2.getMinutes() + this.timezoneOffset);

    if (d1.getHours() === d2.getHours() && d1.getHours() === 0) {
      allDay = true;
    }

    return {
      start: d1.toISOString(),
      end: d2.toISOString(),
      allDay: googleEvent.allDay
    };
  }

  public deleteCalendarEvent(eventToDelete: any) {
    console.log(eventToDelete);
    const callable = this.fns.httpsCallable('callDeleteGoogleEvent');
    return callable({ eventToDelete }).pipe(
      catchError((err) => {
        console.log(err);
        this.notificationService.showNotification(`notifications.calendarEvents.deleteError`, 'danger');
        return of(err);
      }),
      tap(() => this.notificationService.showNotification(`notifications.calendarEvents.deleteSuccess`, 'success'))
    ).toPromise();
  }

  public createGoogleCalendarEvent(data: any): Promise<any> {
    const callable = this.fns.httpsCallable('callCreateEvent');
    return callable(data).pipe(
      catchError((err) => {
        console.log(err);
        this.notificationService.showNotification(`notifications.calendarEvents.createError`, 'danger');
        return of(err);
      }),
      tap((result) => {
        console.log(result);
        if (result && result.error) {
          this.notificationService.showNotification(`notifications.calendarEvents.createError`, 'danger');
        }
      })
    ).toPromise();
  }

}
