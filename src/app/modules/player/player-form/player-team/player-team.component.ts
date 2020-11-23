import { Component, OnInit } from '@angular/core';

@Component({

  selector: 'app-player-team',
  templateUrl: './player-team.component.html',
  styleUrls: ['./player-team.component.scss']
})
export class PlayerTeamComponent implements OnInit {

  showList = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleList(): void {
    this.showList = !this.showList;
  }

}
