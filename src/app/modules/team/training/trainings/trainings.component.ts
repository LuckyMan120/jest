import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Location } from '../../../location/_interfaces/location.interface';
import { Season } from './../../../../shared/_interfaces/season.interface';
import { TeamService } from './../../team.service';

@Component({

  selector: 'trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss']
})
export class TrainingsComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  seasons$!: Observable<Season[]>;
  locations$!: Observable<Location[]>;

  currentSeason!: string;

  sub: Subscription | undefined;

  constructor(
    private teamService: TeamService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      season: null,
      location: 0
    });

    this.seasons$ = this.teamService.getSeasonList().pipe(
      tap(seasons => {
        if (seasons.length > 0) {
          this.form.get(`season`)?.setValue(seasons[0].id);
        }
      })
    );
    this.locations$ = this.teamService.getTrainingLocations();
    this.sub = this.form.get('season')?.valueChanges.subscribe(val => this.currentSeason = val);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
