import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { createProxy, get } from 'ts-object-path';
import { HtmlClassService } from '../../../../../shared/services/html-class.service';
import { MenuOptions } from './../../../../../shared/directives/menu.directive';
import { OffcanvasOptions } from './../../../../../shared/directives/offcanvas.directive';
import { LayoutConfigService } from './../../../../../shared/services/layout-config.service';
import { MenuHorizontalService } from './../../../../../shared/services/menu-horizontal.service';

@Component({
  selector: 'app-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuHorizontalComponent implements OnInit {

  currentRouteUrl: any = '';

  rootArrowEnabled!: boolean;

  menuOptions: MenuOptions = {
    submenu: {
      desktop: 'dropdown',
      tablet: 'accordion',
      mobile: 'accordion'
    },
    accordion: {
      slideSpeed: 200, // accordion toggle slide speed in milliseconds
      expandAll: false // allow having multiple expanded accordions in the menu
    }
  };

  offCanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: 'app-header-menu-wrapper',
    closeBy: 'app_header_menu_mobile_close_btn',
    toggleBy: {
      target: 'app_header_mobile_toggler',
      state: 'app-header-mobile__toolbar-toggler--active'
    }
  };

  constructor(
    public htmlClassService: HtmlClassService,
    public menuHorService: MenuHorizontalService,
    private layoutConfigService: LayoutConfigService,
    private router: Router,
    private render: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
  }


  ngOnInit(): void {
    this.rootArrowEnabled = this.layoutConfigService.getConfigValue('headerMenuSelfRootArrow');

    this.currentRouteUrl = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRouteUrl = this.router.url;
        this.cdr.markForCheck();
      });
  }

  mouseEnter(e: Event) {
    // check if the left aside menu is fixed
    if (!document.body.classList.contains('app-menu__item--hover')) {
      this.render.addClass(document.body, 'app-menu__item--hover');
    }
  }

  mouseLeave(event: MouseEvent) {
    this.render.removeClass(event.target, 'app-menu__item--hover');
  }

  getItemCssClasses(item: any) {
    let classes = 'app-menu__item';
    const p = createProxy<any>();

    if (get(item, p.submenu)) {
      classes += ' app-menu__item--submenu';
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' app-menu__item--active app-menu__item--here';
    }

    if (item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' app-menu__item--open app-menu__item--here';
    }

    if (get(item, p.resizer)) {
      classes += ' app-menu__item--resize';
    }

    const menuType = get(item, p.submenu.type) || 'classic';
    if ((get(item, p.root) && menuType === 'classic')
      || parseInt(get(item, p.submenu.width), 10) > 0) {
      classes += ' app-menu__item--rel';
    }

    const customClass = get(item, p['custom-class']);
    if (customClass) {
      classes += ' ' + customClass;
    }

    if (get(item, p['icon-only'])) {
      classes += ' app-menu__item--icon-only';
    }

    return classes;
  }

  getItemAttrSubmenuToggle(item: any) {
    const p = createProxy<any>();
    let toggle = 'hover';
    if (get(item, p.toggle) === 'click') {
      toggle = 'click';
    } else if (get(item, p.submenu.type) === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  getItemMenuSubmenuClass(item: any) {
    let classes = '';
    const p = createProxy<any>();

    const alignment = get(item, p.alignment) || 'right';

    if (alignment) {
      classes += ' app-menu__submenu--' + alignment;
    }

    const type = get(item, p.type) || 'classic';
    if (type === 'classic') {
      classes += ' app-menu__submenu--classic';
    }
    if (type === 'tabs') {
      classes += ' app-menu__submenu--tabs';
    }
    if (type === 'mega') {
      if (get(item, p.width)) {
        classes += ' app-menu__submenu--fixed';
      }
    }

    if (get(item, p.pull)) {
      classes += ' app-menu__submenu--pull';
    }

    return classes;
  }

  isMenuItemIsActive(item: any): boolean {
    if (item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  isMenuRootItemIsActive(item: any): boolean {
    if (item.submenu.items) {
      for (const subItem of item.submenu.items) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (item.submenu.columns) {
      for (const subItem of item.submenu.columns) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (typeof item.submenu[Symbol.iterator] === 'function') {
      for (const subItem of item.submenu) {
        const active = this.isMenuItemIsActive(subItem);
        if (active) {
          return true;
        }
      }
    }

    return false;
  }
}
