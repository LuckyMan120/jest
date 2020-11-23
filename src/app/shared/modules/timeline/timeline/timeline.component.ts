import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimeLineEvent } from '../_interfaces/time-line-event.interface';
import { FirestoreService } from './../../../services/firestore.service';
import { TimeLineService } from './../timline.service';

@Component({

  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  data$!: Observable<Data>;
  view$!: Observable<string>;
  events$!: Observable<TimeLineEvent[]>;

  constructor(
    private route: ActivatedRoute,
    private timeLineService: TimeLineService,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
    this.data$ = this.route.data.pipe(
      map(data => {
        this.events$ = this.timeLineService.getEvents(data.data.type, data.data.id);
        return data;
      })
    );
    this.view$ = this.route.params.pipe(map((data: Data) => data.view));
  }

  deleteEvent(item: TimeLineEvent) {
    this.firestoreService.removeItem('timeline', item, 'timeline');
  }

}
