import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Player } from '../_interfaces/player.interface';

@Component({

  selector: 'app-player-statistics',
  templateUrl: './player-statistics.component.html',
  styleUrls: ['./player-statistics.component.scss']
})
export class PlayerStatisticsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PlayerStatisticsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<Player[]>,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  close() {
    return this.dialogRef.close();
  }

  async showPlayer(id: string) {
    await this.router.navigate(['/players/detail', id]);
    return this.dialogRef.close();
  }

}
