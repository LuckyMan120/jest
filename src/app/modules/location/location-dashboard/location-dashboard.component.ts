import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Observable } from 'rxjs';
import { LocationService } from '../location.service';
import { Location } from '../_interfaces/location.interface';

@Component({
  selector: 'app-location-dashboard',
  templateUrl: './location-dashboard.component.html',
  styleUrls: ['./location-dashboard.component.scss']
})
export class LocationDashboardComponent implements OnInit {

  statistics$!: Observable<{ labels: string[], datasets: any[] }>;
  latestLocation$!: Observable<Location>;

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      position: 'bottom'
    },
    cutoutPercentage: 30
  };

  constructor(
    private locationService: LocationService
  ) {
  }

  ngOnInit() {
    // this.statistics$ = this.locationService.getLocationStatistics();
    // this.latestLocation$ = this.locationService.getLatestLocation();
  }

}
