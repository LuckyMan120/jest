import { Component, OnInit } from '@angular/core';
import { HtmlClassService } from '../../../../shared/services/html-class.service';
import { ToggleOptions } from './../../../../shared/directives/toggle.directive';
import { LayoutConfigService } from './../../../../shared/services/layout-config.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html'
})
export class BrandComponent implements OnInit {

  headerLogo!: string;
  headerStickyLogo!: string;

  toggleOptions: ToggleOptions = {
    target: 'body',
    targetState: 'app-aside--minimize',
    togglerState: 'app-aside__brand-aside-toggler--active'
  };

  constructor(
    private layoutConfigService: LayoutConfigService,
    public htmlClassService: HtmlClassService
  ) {
  }

  ngOnInit(): void {
    this.headerLogo = this.layoutConfigService.getLogo();
    this.headerStickyLogo = this.layoutConfigService.getStickyLogo();
  }
}
