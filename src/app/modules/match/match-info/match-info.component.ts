import { Component, Input, OnInit } from '@angular/core';
import { Match } from '../_interfaces/match.interface';

@Component({

  selector: 'match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.scss']
})
export class MatchInfoComponent implements OnInit {

  @Input() match!: Match;

  constructor() {
  }

  ngOnInit() {
  }

}
