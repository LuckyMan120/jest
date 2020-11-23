import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../../../modules/article/_interfaces/article.interface';
import { Application } from '../../../modules/settings/_interfaces/application.interface';
import { ApplicationService } from './../../../modules/settings/application.service';
import { LayoutConfigService } from './../../../shared/services/layout-config.service';
import { SplashScreenService } from './../../../shared/services/splash-screen.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {

  today: number = Date.now();
  headerLogo!: string;
  backgroundImage = '';
  copyright = '';
  mainLogo = '';
  pageTitle = '';

  articles$!: Observable<Article[]>;
  application$!: Observable<Application | undefined>;

  constructor(
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService,
    private applicationService: ApplicationService,
    // private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.backgroundImage = this.layoutConfigService.getConfigValue('selfBodyBackgroundImage');
    this.mainLogo = this.layoutConfigService.getConfigValue('selfLogo');
    this.headerLogo = this.layoutConfigService.getLogo();
    this.splashScreenService.hide();

    this.application$ = this.applicationService.getCurrentApplication();
    // this.articles$ = this.applicationService.getFooterArticles();
  }

  /* showArticle(article: Article) {
    return this.dialog.open(ArticleDialogComponent, {
      data: article,
      width: '80vw',
      height: '80vh'
    });
  } */
}
