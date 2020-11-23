import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutConfigService } from './../../../../shared/services/layout-config.service';
import { SplashScreenService } from './../../../../shared/services/splash-screen.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {

  loaderLogo!: string;

  @ViewChild('splashScreen', { static: true }) splashScreen!: ElementRef;

  constructor(
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService
  ) {
  }

  ngOnInit() {
    this.loaderLogo = this.layoutConfigService.getConfigValue('loaderLogo');
    this.splashScreenService.init(this.splashScreen);
  }
}
