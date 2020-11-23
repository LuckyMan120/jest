import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimeLineEvent } from '../_interfaces/time-line-event.interface';

@Component({

  selector: 'timeline-view',
  templateUrl: './timeline-view.component.html',
  styleUrls: ['./timeline-view.component.scss']
})
export class TimelineViewComponent implements OnInit {

  @Input() events!: TimeLineEvent[];
  @Output() deleteEvent: EventEmitter<TimeLineEvent> = new EventEmitter<TimeLineEvent>(false);

  constructor() { }

  ngOnInit() {
  }

}
