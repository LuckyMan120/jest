import { Component, Input, OnInit } from '@angular/core';
import { Match } from '../../_interfaces/match.interface';

@Component({

  selector: 'match-info-right',
  templateUrl: './match-info-right.component.html',
  styleUrls: ['./match-info-right.component.scss']
})
export class MatchInfoRightComponent implements OnInit {

  @Input() match!: Match;

  constructor() {
  }

  ngOnInit() {
  }

}
