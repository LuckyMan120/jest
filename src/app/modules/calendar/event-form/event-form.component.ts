import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Calendar } from '../../settings/_interfaces/calendar.interface';
import { ApplicationService } from './../../settings/application.service';
import { CalEvent } from './../_interfaces/cal-event.interface';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  form!: FormGroup;
  calendars$!: Observable<Calendar[] | undefined>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventFormComponent>,
    private applicationService: ApplicationService,
    @Inject(MAT_DIALOG_DATA) public event: CalEvent,
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      summary: ['', Validators.required],
      description: '',
      start: [new Date(), Validators.required],
      end: [new Date(), Validators.required],
      calendarId: [null, Validators.required],
      allDayEvent: [false, Validators.required],
    });

    this.calendars$ = this.applicationService.getCalendars();
  }

  get descriptionControl() {
    return this.form.controls.description;
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.form.value);
  }

}
