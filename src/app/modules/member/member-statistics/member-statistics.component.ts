import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({

  selector: 'app-member-statistics',
  templateUrl: './member-statistics.component.html',
  styleUrls: ['./member-statistics.component.scss']
})
export class MemberStatisticsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MemberStatisticsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { memberList: Observable<any>, type: string },
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  close() {
    return this.dialogRef.close();
  }

  async showMember(id: string) {
    await this.router.navigate(['/members/detail', id]);
    return this.dialogRef.close();
  }

}
