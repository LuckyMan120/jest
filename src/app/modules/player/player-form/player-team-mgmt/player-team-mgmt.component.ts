import { Component, OnInit } from '@angular/core';

@Component({

  selector: 'app-player-team-mgmt',
  templateUrl: './player-team-mgmt.component.html',
  styleUrls: ['./player-team-mgmt.component.scss']
})
export class PlayerTeamMgmtComponent implements OnInit {

  showList = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleList(): void {
    this.showList = !this.showList;
  }

}
