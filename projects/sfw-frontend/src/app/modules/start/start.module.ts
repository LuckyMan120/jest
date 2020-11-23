import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { EventListComponent } from './start-index/event-list/event-list.component';
import { LatestResultsComponent } from './start-index/latest-results/latest-results.component';
import { NewsListComponent } from './start-index/news-list/news-list.component';
import { NewsletterComponent } from './start-index/newsletter/newsletter.component';
import { PartnerComponent } from './start-index/partner/partner.component';
import { StartIndexComponent } from './start-index/start-index.component';
import { TopNewsComponent } from './start-index/top-news/top-news.component';
import { UpcomingMatchComponent } from './start-index/upcoming-match/upcoming-match.component';
import { StartRoutingModule } from './start-routing.module';


@NgModule({
  declarations: [
    EventListComponent,
    LatestResultsComponent,
    NewsListComponent,
    NewsletterComponent,
    PartnerComponent,
    StartIndexComponent,
    TopNewsComponent,
    UpcomingMatchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StartRoutingModule
  ]
})
export class StartModule { }
