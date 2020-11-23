import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutConfigService } from './shared/services/layout-config.service';
import { SplashScreenService } from './shared/services/splash-screen.service';

@Component({
  selector: 'body[app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  loader!: boolean;

  private unsubscribe: Subscription[] = [];

  constructor(
    private router: Router,
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService,
  ) {
  }

  ngOnInit(): void {
    // this.seoService.init();
    this.loader = this.layoutConfigService.getConfigValue('loaderEnabled');

    const routerSubscription = this.router.events.subscribe(event => {
      if (this.loader && event instanceof NavigationEnd) {
        this.splashScreenService.hide();
        window.scrollTo(0, 0);
      }
      setTimeout(() => document.body.classList.add('app-page--loaded'), 500);
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
