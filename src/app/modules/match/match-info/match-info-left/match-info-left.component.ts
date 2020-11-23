import { Component, Input, OnInit } from '@angular/core';
import { Match } from '../../_interfaces/match.interface';

@Component({

  selector: 'match-info-left',
  templateUrl: './match-info-left.component.html',
  styleUrls: ['./match-info-left.component.scss']
})
export class MatchInfoLeftComponent implements OnInit {

  @Input() match!: Match;

  constructor() { }

  ngOnInit() {
  }

}
