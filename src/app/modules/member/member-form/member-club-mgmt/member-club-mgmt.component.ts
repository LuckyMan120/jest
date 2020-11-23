import { Component, OnInit } from '@angular/core';

@Component({

  selector: 'app-member-club-mgmt',
  templateUrl: './member-club-mgmt.component.html',
  styleUrls: ['./member-club-mgmt.component.scss']
})
export class MemberClubMgmtComponent implements OnInit {

  showList = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleList(): void {
    this.showList = !this.showList;
  }

}
