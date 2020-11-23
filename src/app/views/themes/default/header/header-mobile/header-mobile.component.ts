import { Component, OnInit } from '@angular/core';
import { ToggleOptions } from './../../../../../shared/directives/toggle.directive';
import { LayoutConfigService } from './../../../../../shared/services/layout-config.service';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {

  headerLogo!: string;
  asideDisplay!: boolean;

  toggleOptions: ToggleOptions = {
    target: 'body',
    targetState: 'app-header__topbar--mobile-on',
    togglerState: 'app-header-mobile__toolbar-topbar-toggler--active'
  };

  constructor(
    private layoutConfigService: LayoutConfigService
  ) {
  }

  ngOnInit() {
    this.headerLogo = this.layoutConfigService.getLogo();
    this.asideDisplay = this.layoutConfigService.getConfigValue('asideSelfDisplay');
  }
}
