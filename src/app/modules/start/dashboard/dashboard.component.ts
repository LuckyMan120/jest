import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Article } from '../../article/_interfaces/article.interface';
import { MediaService } from './../../../shared/modules/media/media.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { User } from './../../user/_interfaces/user.interface';
import { StartService } from './../start.service';

@Component({

  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {

  maxItems = 7;
  socialMetaTypes: any;

  loading$: any = {
    callAlgoliaExport: new BehaviorSubject<boolean>(false),
    callScrapDFBnetPlayers: new BehaviorSubject<boolean>(false),
    callScrapGoogleDriveMembers: new BehaviorSubject<boolean>(false),
    callScrapFussballdeMatchplan: new BehaviorSubject<boolean>(false),
    callScrapStandings: new BehaviorSubject<boolean>(false)
  };

  latestUsers$!: Observable<User[]>;
  latestArticles$!: Observable<Article[]>;
  latestArticle$!: Observable<Article[]>;
  latestFiles$!: Observable<any[]>;
  applicationStats$!: Observable<{}>;

  playerStatistics$!: Observable<any>;
  articleStatistics$!: Observable<any>;
  mediaStats$!: Observable<any>;

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      position: 'bottom',
      display: true
    },
    cutoutPercentage: 30
  };
  sub!: Subscription;

  constructor(
    private startService: StartService,
    private mediaService: MediaService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.socialMetaTypes = {
      facebook: ['message', 'link', 'imageURL'],
      twitter: ['message', 'imageURL'],
    };
    this.applicationStats$ = this.startService.getApplicationStats();
    this.latestUsers$ = this.startService.getLatestUsers(this.maxItems);
    this.latestArticles$ = this.startService.getLatestArticles(this.maxItems);
    this.mediaStats$ = this.mediaService.getMediaStats();
    this.latestFiles$ = this.startService.getLatestFiles(this.maxItems);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getStatsItem(k: string, v: string) {
    return {
      title: 'Test' + k, v
    };
  }

  callFn(fnName: string, args?: any): Subscription {

    this.loading$[fnName].next(true);

    this.sub = this.startService.callFn(fnName, args).pipe(first())
      .subscribe(resp => {
        this.notificationService.showNotification(`notifications.import.${fnName}.success`, 'success');
        this.loading$[fnName].next(false);
      }, err => {
        this.notificationService.showNotification(`notifications.import.${fnName}.error`, 'danger');
        this.loading$[fnName].next(false);
      });
    return this.sub;
  }

}
