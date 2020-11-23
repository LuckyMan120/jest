import { FormatWidth, getLocaleDateTimeFormat } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClubHonorary } from '../../club/_interfaces/club-honorary.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { ClubHonorariesService } from './../../club/club-honoraries/club-honoraries.service';
import { MemberService } from './../member.service';
import { Member } from './../_interfaces/member.interface';

@Component({

  selector: 'app-member-dashboard',
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.scss']
})
export class MemberDashboardComponent implements OnInit {

  latestSignUps$!: Observable<Member[]>;
  latestSignOuts$!: Observable<Member[]>;
  honoraryList$!: Observable<ClubHonorary[]>;
  statistics$!: Observable<ChartData>;
  isLoadingStats$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  dateFormat!: string;

  public barChartLegend = true;
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  constructor(
    private memberService: MemberService,
    @Inject(LOCALE_ID) private locale: string,
    private clubHonorariesService: ClubHonorariesService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.dateFormat = getLocaleDateTimeFormat(this.locale, FormatWidth.Short);
    this.latestSignUps$ = this.memberService.getLatestSignUps(9);
    this.latestSignOuts$ = this.memberService.getLatestSignedOuts(9);
    this.honoraryList$ = this.clubHonorariesService.getLatestHonoraries(9);
    this.statistics$ = this.firestoreService.getStatistics(`member`).pipe(tap(console.log));
  }

  showDetailedMemberStats(type: string) {
    this.isLoadingStats$.next(true);
    // this.layoutUtilsService.showMemberStatistics({ memberList: this.memberService.getDetailedMemberStatistics(type), type });
    this.isLoadingStats$.next(false);
  }

}
