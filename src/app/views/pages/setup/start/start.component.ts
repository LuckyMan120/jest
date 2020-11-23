import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  today = new Date();
  env: any;

  constructor(
  ) {
  }

  ngOnInit(): void {
    this.env = environment;
  }

}
