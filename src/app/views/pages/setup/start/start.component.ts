import { Component, OnInit } from '@angular/core';
import { defaults } from './../../../../../environments/defaults';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  today = new Date();
  defaults: any;

  constructor(
  ) {
  }

  ngOnInit(): void {
    this.defaults = defaults;
  }

}
