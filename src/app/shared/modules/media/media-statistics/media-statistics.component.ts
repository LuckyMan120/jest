import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({

  selector: 'app-media-statistics',
  templateUrl: './media-statistics.component.html',
  styleUrls: ['./media-statistics.component.scss']
})
export class MediaStatisticsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MediaStatisticsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<any>,
  ) {

  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

}
