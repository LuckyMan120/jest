import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarService } from './../../../calendar/calendar.service';
import { TeamService } from './../../team.service';
import { Training } from './../_interfaces/training.interface';

@Component({

  selector: 'training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit, OnChanges {

  @Input() seasonId!: string;
  @Input() locationId!: string;
  @Output() editTraining: EventEmitter<Training> = new EventEmitter<Training>(false);

  trainings$!: Observable<Training[]>;
  trainings!: Training[];

  timeSlots!: {
    slot: any;
    startTime: any;
  }[];
  weekDays!: string[];
  trainingsHours!: string[];

  constructor(
    private calendarService: CalendarService,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.timeSlots = this.calendarService.getTimeSlots(15);
    this.weekDays = this.calendarService.getLocaleWeek();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.locationId && changes.locationId.currentValue !== 0 && changes.seasonId && changes.seasonId.currentValue) {
      this.trainings$ = this.teamService.getTrainingSessions({
        locationId: changes.locationId.currentValue,
        seasonId: changes.seasonId.currentValue
      });
    }
  }

  removeTraining(training: Training) {
    const day = this.calendarService.getLocaleDay(training.day);
    training.title = `${day}, ${training.startSlot} - ${training.endSlot}`;
    this.teamService.deleteTraining(training);
  }

}
