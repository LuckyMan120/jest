import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Application } from '../../../settings/_interfaces/application.interface';
import { StartService } from './../../start.service';

@Component({

  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss']
})
export class CalendarEventComponent implements OnInit {

  form!: FormGroup;
  errorMessage!: string;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  application$!: Observable<Application | undefined>;

  constructor(
    private fb: FormBuilder,
    private startService: StartService
  ) { }

  ngOnInit(): void {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);

    const later = new Date(now.valueOf());
    later.setHours(later.getHours() + 1);

    this.application$ = this.startService.getCurrentApplication();

    this.form = this.fb.group({
      calendarId: ['', [Validators.required]],
      summary: ['', [Validators.required, Validators.minLength(5)]],
      description: '',
      location: '',
      startDate: [now, [Validators.required]],
      endDate: [later, [Validators.required]],
      allDay: true
    });
  }

  public get assignedLocationControl() {
    return this.form.controls.location;
  }

  onSubmit(): void {
    this.isLoading$.next(true);
    console.log(this.form.value);
    this.isLoading$.next(false);
    /* this.startService.createGoogleCalendarEvent(this.form.value)
      .then(() => this.form.reset())
      .catch(e => this.errorMessage = e)
      .finally(() => this.isLoading$.next(false)); */
  }

}
