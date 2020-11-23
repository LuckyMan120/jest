import { Component, OnInit } from '@angular/core';
import { Match } from '@match/_interfaces/match.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StartService } from './../start.service';

@Component({
  selector: 'app-upcoming-match',
  templateUrl: './upcoming-match.component.html',
  styleUrls: ['./upcoming-match.component.scss'],
})
export class UpcomingMatchComponent implements OnInit {

  match$!: Observable<Match>;

  constructor(
    private startService: StartService
  ) { }

  ngOnInit() {
    const args = {
      matchStartDate: { value: (new Date()).valueOf(), operator: '>=' },
      isOfficialMatch: { value: true, operator: '==' },
      'publication.status': { value: 1, operator: '==' }
    } as any;

    this.match$ = this.startService.getItemList('matches', args, { field: 'matchStartDate', value: 'asc' }, 1).pipe(
      map(matches => matches[0])
    );
  }

}
