import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { LayoutUtilsService } from './../../../shared/services/layout-utils.service';
import { ProfileService } from './../../../shared/services/profile.service';
import { PlayerService } from './../player.service';
import { Player } from './../_interfaces/player.interface';

@Component({

  selector: 'app-player-dashboard',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.scss']
})
export class PlayerDashboardComponent implements OnInit {

  statistics$!: Observable<any>;

  latestPlayers$!: Observable<Player[]>;
  oldestPlayers$!: Observable<Player[]>;
  youngestPlayers$!: Observable<Player[]>;
  longestPlayers$!: Observable<Player[]>;
  guestPlayers$!: Observable<Player[]>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingStats$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public barChartOptions: ChartOptions = {};

  constructor(
    private playerService: PlayerService,
    private firestoreService: FirestoreService,
    private layoutUtilsService: LayoutUtilsService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.statistics$ = this.firestoreService.getStatistics(`player`);

    this.latestPlayers$ = this.playerService.getLatestPlayers(10);
    this.oldestPlayers$ = this.playerService.getPlayersByAge(10, 'asc').pipe(map((players: Player[]) => players.map(p => {
      return { ...p, age: this.profileService.calculateAge(p.birthDate as number) };
    })));
    this.youngestPlayers$ = this.playerService.getPlayersByAge(10, 'desc').pipe(map((players: Player[]) => players.map(p => {
      return { ...p, age: this.profileService.calculateAge(p.birthDate as number) };
    })));
    this.guestPlayers$ = this.playerService.getGuestPlayers();
  }

  async showDetailedPlayerStats() {
    this.isLoadingStats$.next(true);
    const playerList = this.playerService.getDetailedPlayerStatistics();
    this.layoutUtilsService.showPlayerStatistics(playerList);
    this.isLoadingStats$.next(false);
  }

  async exportPlayerStats(): Promise<void> {
    this.isLoading$.next(true);
  }

}
