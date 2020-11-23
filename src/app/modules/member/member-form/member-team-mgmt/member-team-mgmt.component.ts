import { Component, OnInit } from '@angular/core';

@Component({

  selector: 'app-member-team-mgmt',
  templateUrl: './member-team-mgmt.component.html',
  styleUrls: ['./member-team-mgmt.component.scss']
})
export class MemberTeamMgmtComponent implements OnInit {

  showList = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleList() {
    this.showList = !this.showList;
  }

}
