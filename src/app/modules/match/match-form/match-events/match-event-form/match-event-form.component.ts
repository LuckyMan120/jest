import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatchEventCategory } from '../../../_interfaces/match-event-category.interface';
import { MatchEvent } from '../../../_interfaces/match-event.interface';
import { MatchService } from './../../../match.service';
import { Match } from './../../../_interfaces/match.interface';

@Component({

  selector: 'match-event-form',
  templateUrl: './match-event-form.component.html',
  styleUrls: ['./match-event-form.component.scss']
})
export class MatchEventFormComponent implements OnInit {

  @Output() toggleForm: EventEmitter<void> = new EventEmitter<void>(false);
  @Input() match!: Match;
  @Input() selectedEvent!: MatchEvent;

  form!: FormGroup;
  eventCategories!: any[];
  event$!: Observable<MatchEvent>;
  savedEvent!: MatchEvent;
  selectedMatchEventCategory!: MatchEventCategory;
  hasFormErrors = false;

  constructor(
    private matchService: MatchService
  ) {
  }

  ngOnInit() {
    this.form = this.matchService.getEventFormFields();

    this.event$ = this.matchService.getMatchEvent(this.selectedEvent).pipe(
      tap((event: MatchEvent) => {
        this.form.patchValue(event);
        this.savedEvent = Object.freeze(Object.assign({}, event));
        this.changeMatchEvent({ value: event.assignedCategoryId } as any);
      })
    );

    this.eventCategories = this.matchService.getEventCategories();
  }

  get assignedPlayerOneControl(): AbstractControl {
    return this.form.controls.assignedPlayerOneId;
  }

  get assignedPlayerTwoControl(): AbstractControl {
    return this.form.controls.assignedPlayerTwoId;
  }

  onSubmit() {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    const event = this.form.value as MatchEvent;
    if (event.id) {
      const idx = this.match.matchEvents && this.match.matchEvents.findIndex((matchEvent: MatchEvent) => matchEvent.id === event.id);
      if (idx && this.match.matchEvents) {
        this.match.matchEvents[idx] = event;
      }
    } else {
      this.match.matchEvents?.push(event);
    }

    this.matchService.save(this.match).then(() => {
      this.form.reset();
      this.toggleForm.emit();
    });
  }

  changeMatchEvent($event: MatSelectChange): void {
    this.selectedMatchEventCategory = this.eventCategories.find((matchEventCategory: MatchEventCategory) => {
      if (matchEventCategory.id === $event.value && matchEventCategory.showPlayerOneInput) {
        this.form.get('assignedPlayerOneId')?.setValidators(Validators.required);
      } else {
        this.form.get('assignedPlayerOneId')?.clearValidators();
      }
      this.form.get('assignedPlayerOneId')?.updateValueAndValidity();

      if (matchEventCategory.id === $event.value && matchEventCategory.showPlayerTwoInput) {
        this.form.get('assignedPlayerTwoId')?.setValidators(Validators.required);
      } else {
        this.form.get('assignedPlayerTwoId')?.clearValidators();
      }
      this.form.get('assignedPlayerTwoId')?.updateValueAndValidity();
      return matchEventCategory.id === $event.value;
    }) as MatchEventCategory;
  }
}
