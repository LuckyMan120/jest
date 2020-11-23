import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { TabsetComponent } from 'ngx-bootstrap/tabs/public_api';
import { Observable } from 'rxjs';
import { ArticleService } from './../article.service';
import { Article } from './../_interfaces/article.interface';

@Component({
  selector: 'article-dashboard',
  templateUrl: './article-dashboard.component.html',
  styleUrls: ['./article-dashboard.component.scss']
})
export class ArticleDashboardComponent implements OnInit {

  @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;

  latestArticles$!: Observable<Article[]>;
  topArticlesForWeek$!: Observable<Article[]>;
  topArticlesForMonth$!: Observable<Article[]>;
  topArticlesAllTime$!: Observable<Article[]>;
  statistics$!: Observable<any>;
  totalArticles$!: Observable<number>;

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      position: 'bottom'
    },
    cutoutPercentage: 60
  };

  constructor(
    public articleService: ArticleService
  ) {
  }

  ngOnInit() {
    this.totalArticles$ = this.articleService.getTotalArticleCount();
    this.statistics$ = this.articleService.getArticlePublicationStatistics();
    this.topArticlesForWeek$ = this.articleService.getLatestPublishedArticles(5);
    this.topArticlesForMonth$ = this.articleService.getLatestPublishedArticles(5);
    this.topArticlesAllTime$ = this.articleService.getLatestPublishedArticles(5);
    this.latestArticles$ = this.articleService.getLatestPublishedArticles(1);
  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

}
