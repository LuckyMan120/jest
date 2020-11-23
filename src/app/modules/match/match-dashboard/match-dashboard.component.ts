import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Observable } from 'rxjs';
import { MatchService } from '../match.service';
import { Match } from '../_interfaces/match.interface';
import { MatchStats } from './../_interfaces/match-stats.interface';

@Component({

  selector: 'app-match-dashboard',
  templateUrl: './match-dashboard.component.html',
  styleUrls: ['./match-dashboard.component.scss']
})
export class MatchDashboardComponent implements OnInit {

  upcomingMatches$!: Observable<Match[]>;
  matchStats$!: Observable<MatchStats>;
  statistics$!: Observable<any>;
  matchStatistics$!: Observable<any>;

  matchCount = 0;

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      position: 'bottom',
      display: true
    },
    cutoutPercentage: 30
  };

  constructor(private matchService: MatchService) { }

  ngOnInit() {
    this.upcomingMatches$ = this.matchService.getUpcomingMatches(1);

    /* this.matchStatistics$ = this.matchService.getMatchStatistics();

    this.statistics$ = this.matchService.getMatchCount();

    this.matchStats$ = this.matchService.getMatchStats('club').pipe(
      map(stats => {
        for (const matchCount of stats.datasets[0].data) {
          this.matchCount = this.matchCount + matchCount;
        }
        return stats;
      })
    );*/
  }

}
