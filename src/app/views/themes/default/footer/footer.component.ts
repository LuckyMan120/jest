import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../../../../modules/article/_interfaces/article.interface';
import { Application } from '../../../../modules/settings/_interfaces/application.interface';
import { ApplicationService } from './../../../../modules/settings/application.service';
import { LayoutConfigService } from './../../../../shared/services/layout-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  today: number = Date.now();
  public fluid!: boolean;
  articles$!: Observable<Article[]>;
  settings$!: Observable<Application | undefined>;

  constructor(
    private applicationService: ApplicationService,
    private layoutConfigService: LayoutConfigService
  ) {
  }

  ngOnInit(): void {
    this.fluid = this.layoutConfigService.getConfigValue('footerSelfWidth') === 'fluid';
    this.settings$ = this.applicationService.getCurrentApplication();
    this.articles$ = this.applicationService.getFooterArticles();
  }
}
