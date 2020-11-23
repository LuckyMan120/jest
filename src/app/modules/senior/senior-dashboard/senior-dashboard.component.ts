import { FormatWidth, getLocaleDateTimeFormat } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { Senior } from '../_interfaces/senior.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { LayoutUtilsService } from './../../../shared/services/layout-utils.service';
import { SeniorService } from './../senior.service';

@Component({

  selector: 'app-senior-dashboard',
  templateUrl: './senior-dashboard.component.html'
})
export class SeniorDashboardComponent implements OnInit {

  latestSignUps$!: Observable<Senior[]>;
  latestSignOuts$!: Observable<Senior[]>;
  honoraryList$!: Observable<Senior[]>;
  statistics$!: Observable<any>;
  isLoadingStats$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  dateFormat!: string;

  chartOptions: ChartOptions = {};

  constructor(
    private seniorService: SeniorService,
    @Inject(LOCALE_ID) private locale: string,
    private layoutUtilsService: LayoutUtilsService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.dateFormat = getLocaleDateTimeFormat(this.locale, FormatWidth.Short);
    this.latestSignUps$ = this.seniorService.getLatestSignUps(9);
    this.latestSignOuts$ = this.seniorService.getLatestSignedOuts(9);
    this.honoraryList$ = this.seniorService.getHonoraryList();
    // this.statistics$ = this.firestoreService.getStatistics('senior');
  }

  showDetailedStats(type: string) {
    this.isLoadingStats$.next(true);
    // this.layoutUtilsService.showMemberStatistics({ memberList: this.seniorService.getDetailedStatistics(), type });
    this.isLoadingStats$.next(false);
  }

}
