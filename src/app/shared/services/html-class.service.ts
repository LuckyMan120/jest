import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createProxy, get, set } from 'ts-object-path';
import { MenuItem } from '../_interfaces/menu-item.interface';
import { LayoutConfigService } from './layout-config.service';

export interface ClassType {
  header: string[];
  header_mobile: string[];
  header_menu: string[];
  aside_menu: string[];
}

@Injectable()
export class HtmlClassService {

  config!: MenuItem[];
  classes!: ClassType;
  onClassesUpdated$: BehaviorSubject<ClassType>;

  constructor(
    private layoutConfigService: LayoutConfigService
  ) {
    this.onClassesUpdated$ = new BehaviorSubject(this.classes);
  }

  setConfig(layoutConfig: MenuItem[]) {
    this.config = layoutConfig;

    this.classes = { header: [], header_mobile: [], header_menu: [], aside_menu: [] };

    this.initLayout();
    this.initLoader();
    this.initHeader();
    this.initSubheader();
    this.initAside();
    this.initFooter();

    this.initSkins();

    this.onClassesUpdated$.next(this.classes);
  }

  getClasses(path?: string, toString?: boolean): ClassType | string[] | string {
    const p = createProxy<any>();
    if (path) {
      const classes = get(this.classes, p[path]) || '';
      if (toString && typeof classes === 'object') {
        return classes.join(' ');
      }
      return classes.toString();
    }
    return this.classes;
  }

  private initLayout() {
    if (this.layoutConfigService.getConfigValue('selfLayout')) {
      document.body.classList.add(this.layoutConfigService.getConfigValue('selfLayout') as string);
    }
    // eslint-disable-next-line
    if (this.layoutConfigService.getConfigValue('selfLayout') === 'boxed' && this.layoutConfigService.getConfigValue('selfBodyBackgroundImage')) {
      document.body.style.backgroundImage = 'url("' + this.layoutConfigService.getConfigValue('selfBodyBackgroundImage') + '")';
    }

    document.body.classList.add('app-quick-panel--right');
    document.body.classList.add('app-demo-panel--right');
    document.body.classList.add('app-offcanvas-panel--right');
  }

  private initLoader() {
  }

  private initHeader() {

    if (this.layoutConfigService.getConfigValue('headerSelfFixedDesktop')) {
      document.body.classList.add('app-header--fixed');
      set(this.classes, (p: any) => p.header, 'app-header--fixed');
    } else {
      document.body.classList.add('app-header--static');
      set(this.classes, (p: any) => p.header, 'app-header--static');
    }

    if (this.layoutConfigService.getConfigValue('headerSelfFixedMobile')) {
      document.body.classList.add('app-header-mobile--fixed');
      set(this.classes, (p: any) => p.header_mobile, 'app-header-mobile--fixed');
    }

    if (this.layoutConfigService.getConfigValue('headerMenuSelfLayout')) {
      // eslint-disable-next-line
      set(this.classes, (p: any) => p.header_menu, `app-header-menu--layout-${this.layoutConfigService.getConfigValue('headerMenuSelfLayout')}`);
    }
  }

  private initSubheader() {
    if (this.layoutConfigService.getConfigValue('subheaderFixed')) {
      document.body.classList.add('app-subheader--fixed');
    }

    if (this.layoutConfigService.getConfigValue('subheaderDisplay')) {
      document.body.classList.add('app-subheader--enabled');
    }

    if (this.layoutConfigService.getConfigValue('subheaderStyle')) {
      document.body.classList.add('app-subheader--' + this.layoutConfigService.getConfigValue('subheaderStyle'));
    }
  }

  private initAside() {
    if (this.layoutConfigService.getConfigValue('asideSelfDisplay') !== true) {
      return;
    }

    document.body.classList.add('app-aside--enabled');

    if (this.layoutConfigService.getConfigValue('asideSelfSkin')) {
      set(this.classes, (p: any) => p.aside, 'app-aside--skin-' + this.layoutConfigService.getConfigValue('asideSelfSkin'));
      set(this.classes, (p: any) => p.aside_menu, `app-aside-menu--skin-${this.layoutConfigService.getConfigValue('asideSelfSkin')}`);
      set(this.classes, (p: any) => p.brand, 'app-aside__brand--skin-' + this.layoutConfigService.getConfigValue('asideSelfSkin'));

      document.body.classList.add('app-aside--skin-' + this.layoutConfigService.getConfigValue('asideSelfSkin'));
      document.body.classList.add('app-aside__brand--skin-' + this.layoutConfigService.getConfigValue('asideSelfSkin'));
    }

    if (this.layoutConfigService.getConfigValue('asideSelfFixed')) {
      document.body.classList.add('app-aside--fixed');
      set(this.classes, (p: any) => p.aside, 'app-aside--fixed');
    } else {
      document.body.classList.add('app-aside--static');
    }

    if (this.layoutConfigService.getConfigValue('asideSelfMinimizeDefault')) {
      document.body.classList.add('app-aside--minimize');
    }

    if (this.layoutConfigService.getConfigValue('asideMenuDropdown')) {
      set(this.classes, (p: any) => p.aside_menu, 'app-aside-menu--dropdown');
    }
  }

  private initFooter() {
    if (this.layoutConfigService.getConfigValue('footerSelfWidth') === 'fixed') {
      document.body.classList.add('app-footer--fixed');
    }
  }

  private initSkins() {
    if (this.layoutConfigService.getConfigValue('headerSelfSkin')) {
      document.body.classList.add('app-header-base-' + this.layoutConfigService.getConfigValue('headerSelfSkin'));
    }
    if (this.layoutConfigService.getConfigValue('headerMenuDesktopSubmenuSkin')) {
      document.body.classList.add('app-header-menu-' + this.layoutConfigService.getConfigValue('headerMenuDesktopSubmenuSkin'));
    }
    if (this.layoutConfigService.getConfigValue('brandSelfSkin')) {
      document.body.classList.add('app-brand-' + this.layoutConfigService.getConfigValue('brandSelfSkin'));
    }
    if (this.layoutConfigService.getConfigValue('asideSelfSkin')) {
      document.body.classList.add('app-aside-' + this.layoutConfigService.getConfigValue('asideSelfSkin'));
    }
  }

}
