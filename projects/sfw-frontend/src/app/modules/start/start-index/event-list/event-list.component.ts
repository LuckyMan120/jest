import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Match } from '@match/_interfaces/match.interface';
import { Observable } from 'rxjs';
import { StartService } from '../start.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventListComponent implements OnInit {

  events$!: Observable<Match[]>;

  slideConfig = {
    dots: false,
    arrows: true,
    autoplay: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    variableWidth: true,
    nextArrow: '<a class="arrow-next"></a>',
    prevArrow: '<a class="arrow-prev"></a>'
  };

  constructor(
    private startService: StartService
  ) { }

  ngOnInit() {
    const args = {
      matchStartDate: { value: (new Date()).valueOf(), operator: '<=' },
      isCompleted: { value: true, operator: '==' },
      isOfficialMatch: { value: true, operator: '==' },
      'publication.status': { value: 1, operator: '==' },
    } as any;

    this.events$ = this.startService.getItemList('matches', args, { field: 'matchStartDate', value: 'desc' }, 10);
  }

}
