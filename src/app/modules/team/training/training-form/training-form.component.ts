import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../../shared/services/firestore.service';
import { Season } from '../../../../shared/_interfaces/season.interface';
import { TeamService } from '../../team.service';
import { Training } from '../_interfaces/training.interface';
import { CalendarService } from './../../../calendar/calendar.service';

@Component({

  selector: 'training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.scss']
})
export class TrainingFormComponent implements OnInit {

  form!: FormGroup;

  seasons$!: Observable<Season[]>;
  training$!: Observable<Training>;

  training!: Training;
  weekDays!: string[];
  lastFullHour!: Date;
  nextFullHour!: Date;

  error: any;
  hasFormErrors = false;

  trainingStep!: number;

  constructor(
    private teamService: TeamService,
    private firestoreService: FirestoreService,
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.form = this.teamService.getTrainingFormFields();

    this.training$ = this.route.params.pipe(
      switchMap((params: Params) => this.teamService.getTraining(params.trainingId)),
      tap((training: Training) => this.form.patchValue(training))
    );

    this.seasons$ = this.firestoreService.col$<Season>(`seasons`);

    this.trainingStep = 15; // environment.training.value;
    console.log('ToDo: Load TrainingStep from Database');
    this.weekDays = this.calendarService.getLocaleWeek();

    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    this.lastFullHour = now;
    this.nextFullHour = now;
  }

  get assignedTeamsControl() {
    return this.form.controls.assignedTeamIds;
  }

  get assignedLocationControl() {
    return this.form.controls.assignedLocationId;
  }

  onSubmit() {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    const training = this.form.value as Training;
    const startSlot = this.calendarService.getLocaleTime(training.startTime as any);
    const endSlot = this.calendarService.getLocaleTime(training.endTime as any);

    if (startSlot && endSlot) {
      training.startSlot = startSlot;
      training.endSlot = endSlot;
      training.startTime = training.startTime.valueOf();
      training.endTime = training.endTime.valueOf();
      this.teamService.saveTraining(training).then(() => this.redirectToList());
    }
  }

  deleteTraining(training: Training) {
    this.teamService.deleteTraining(training); // .then(() => this.redirectToList())
  }

  cancel() {
    this.redirectToList();
  }

  redirectToList() {
    this.router.navigate(['/teams/trainings']).then();
  }

}
