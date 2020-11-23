import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({

  selector: 'app-senior-statistics',
  templateUrl: './senior-statistics.component.html',
  styleUrls: ['./senior-statistics.component.scss']
})
export class SeniorStatisticsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SeniorStatisticsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { seniorList: Observable<any>, type: string },
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  close() {
    return this.dialogRef.close();
  }

  async showSenior(id: string) {
    await this.router.navigate(['/seniors/detail', id]);
    return this.dialogRef.close();
  }

}
