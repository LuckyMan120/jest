import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatchService } from '../../match.service';
import { MatchEventCategory } from '../../_interfaces/match-event-category.interface';
import { MatchEvent } from '../../_interfaces/match-event.interface';
import { Match } from '../../_interfaces/match.interface';

@Component({

  selector: 'match-events',
  templateUrl: './match-events.component.html',
  styleUrls: ['./match-events.component.scss']
})
export class MatchEventsComponent implements OnInit {

  showForm = false;

  eventCategories!: MatchEventCategory[];
  match$!: Observable<Match>;
  match!: Match;
  selectedEvent!: MatchEvent;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
  ) {
  }

  ngOnInit() {
    this.match$ = this.route.params.pipe(
      switchMap(params => this.matchService.get(params.matchId)),
      map((match: Match) => this.match = match)
    );
    this.eventCategories = this.matchService.getEventCategories();
  }

  deleteMatchEvent($event: MatchEvent) {
    return this.matchService.deleteMatchEvent($event, this.match);
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  editMatchEvent(event: MatchEvent) {
    this.selectedEvent = event;
    this.toggleForm();
  }

}
