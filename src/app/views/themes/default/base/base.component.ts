import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { HtmlClassService } from '../../../../shared/services/html-class.service';
import { MenuConfig } from './../../../../shared/config/menu.config';
import { LayoutConfigService } from './../../../../shared/services/layout-config.service';
import { MenuConfigService } from './../../../../shared/services/menu-config.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit, OnDestroy {

  selfLayout!: string;
  asideDisplay!: boolean;
  subheaderDisplay!: boolean;
  desktopHeaderDisplay!: boolean;
  footerDisplay!: boolean;
  fitTop!: boolean;
  fluid!: boolean;

  private unsubscribe: Subscription[] = [];

  constructor(
    private layoutConfigService: LayoutConfigService,
    private menuConfigService: MenuConfigService,
    private htmlClassService: HtmlClassService
  ) {
    // this.layoutConfigService.loadConfigs(new LayoutConfig().configs);
    this.menuConfigService.loadConfigs(new MenuConfig().configs);

    this.htmlClassService.setConfig(this.layoutConfigService.getConfig());

    const subscr = this.layoutConfigService.onConfigUpdated$.subscribe(config => {
      document.body.className = '';
      this.htmlClassService.setConfig(config);
    });
    this.unsubscribe.push(subscr);
  }

  ngOnInit(): void {
    this.selfLayout = this.layoutConfigService.getConfigValue('selfLayout');
    this.asideDisplay = this.layoutConfigService.getConfigValue('asideSelfDisplay');
    this.footerDisplay = this.layoutConfigService.getConfigValue('footerSelfDisplay');
    this.subheaderDisplay = this.layoutConfigService.getConfigValue('subheaderDisplay');
    this.desktopHeaderDisplay = this.layoutConfigService.getConfigValue('headerSelfFixedDesktop');
    this.fitTop = this.layoutConfigService.getConfigValue('contentFitTop');
    this.fluid = this.layoutConfigService.getConfigValue('contentWidth') === 'fluid';

    const layoutConfigSubscription = this.layoutConfigService.onConfigUpdated$.subscribe(cfg => {
      setTimeout(() => {
        this.selfLayout = this.layoutConfigService.getConfigValue('selfLayout');
      });
    });
    this.unsubscribe.push(layoutConfigSubscription);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }


}
