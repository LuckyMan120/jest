import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimeLineEvent } from '../_interfaces/time-line-event.interface';

@Component({

  selector: 'timeline-table',
  templateUrl: './timeline-table.component.html',
  styleUrls: ['./timeline-table.component.scss']
})
export class TimelineTableComponent implements OnInit {

  @Input() events!: TimeLineEvent[];
  @Output() deleteEvent: EventEmitter<TimeLineEvent> = new EventEmitter<TimeLineEvent>(false);

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
