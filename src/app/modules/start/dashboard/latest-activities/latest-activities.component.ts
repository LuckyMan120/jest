import { Component, Input, OnInit } from '@angular/core';

export interface Timeline2Data {
  time: string;
  text: string;
  icon?: string;
  attachment?: string;
}

@Component({

  selector: 'latest-activities',
  templateUrl: './latest-activities.component.html',
  styleUrls: ['./latest-activities.component.scss']
})
export class LatestActivitiesComponent implements OnInit {

  @Input() data!: Timeline2Data[];

  ngOnInit() {

  }
}
