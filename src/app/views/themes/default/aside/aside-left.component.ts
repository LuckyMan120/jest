import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, OnInit, Renderer2, ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { createProxy, get } from 'ts-object-path';
import { HtmlClassService } from '../../../../shared/services/html-class.service';
import { MenuOptions } from './../../../../shared/directives/menu.directive';
import { OffcanvasOptions } from './../../../../shared/directives/offcanvas.directive';
import { LayoutConfigService } from './../../../../shared/services/layout-config.service';
import { MenuAsideService } from './../../../../shared/services/menu-aside.service';

@Component({
  selector: 'app-aside-left',
  templateUrl: './aside-left.component.html',
  styleUrls: ['./aside-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideLeftComponent implements OnInit, AfterViewInit {

  @ViewChild('asideMenu', { static: true }) asideMenu!: ElementRef;

  menu$!: Observable<any>;

  currentRouteUrl = '';
  insideTm: any;
  outsideTm: any;

  menuCanvasOptions: OffcanvasOptions = {
    baseClass: 'app-aside',
    overlay: true,
    closeBy: 'app_aside_close_btn',
    toggleBy: {
      target: 'app_aside_mobile_toggler',
      state: 'app-header-mobile__toolbar-toggler--active'
    }
  };

  menuOptions: MenuOptions = {
    // vertical scroll
    scroll: null,

    // submenu setup
    submenu: {
      desktop: {
        // by default the menu mode set to accordion in desktop mode
        default: 'dropdown'
      },
      tablet: 'accordion', // menu set to accordion in tablet mode
      mobile: 'accordion' // menu set to accordion in mobile mode
    },

    // accordion setup
    accordion: {
      expandAll: false // allow having multiple expanded accordions in the menu
    }
  };

  constructor(
    public htmlClassService: HtmlClassService,
    public menuAsideService: MenuAsideService,
    public layoutConfigService: LayoutConfigService,
    private router: Router,
    private render: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.menu$ = this.menuAsideService.loadMenu();

    this.currentRouteUrl = this.router.url.split(/[?#]/)[0];

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
        this.cdr.markForCheck();
      });

    // eslint-disable-next-line
    if (this.layoutConfigService.getConfigValue('asideMenuDropdown') !== true && this.layoutConfigService.getConfigValue('asideSelfFixed')) {
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-scroll', '1');
    }

    if (this.layoutConfigService.getConfigValue('asideMenuDropdown')) {
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown', '1');
      // eslint-disable-next-line
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown-timeout', this.layoutConfigService.getConfigValue('asideMenuSubmenuDropdownHoverTimeout'));
    }
  }

  isMenuItemIsActive(item: any): boolean {
    if (item && item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item || !item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  isMenuRootItemIsActive(item: any): boolean {
    let result = false;

    for (const subItem of item.submenu) {
      result = this.isMenuItemIsActive(subItem);
      if (result) {
        return true;
      }
    }

    return false;
  }

  mouseEnter(e: Event) {
    // check if the left aside menu is fixed
    if (document.body.classList.contains('app-aside--fixed')) {
      if (this.outsideTm) {
        clearTimeout(this.outsideTm);
        this.outsideTm = null;
      }

      this.insideTm = setTimeout(() => {
        // if the left aside menu is minimized
        if (document.body.classList.contains('app-aside--minimize') && KTUtil.isInResponsiveRange('desktop')) {
          // show the left aside menu
          this.render.removeClass(document.body, 'app-aside--minimize');
          this.render.addClass(document.body, 'app-aside--minimize-hover');
        }
      }, 50);
    }
  }

  mouseLeave(e: Event) {
    if (document.body.classList.contains('app-aside--fixed')) {
      if (this.insideTm) {
        clearTimeout(this.insideTm);
        this.insideTm = null;
      }

      this.outsideTm = setTimeout(() => {
        // if the left aside menu is expand
        if (document.body.classList.contains('app-aside--minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
          // hide back the left aside menu
          this.render.removeClass(document.body, 'app-aside--minimize-hover');
          this.render.addClass(document.body, 'app-aside--minimize');
        }
      }, 100);
    }
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

    // custom class for menu item
    if (get(item, p['custom-class'])) {
      classes += ' ' + item['custom-class'];
    }

    if (get(item, p['icon-only'])) {
      classes += ' app-menu__item--icon-only';
    }

    return classes;
  }

  getItemAttrSubmenuToggle(item: any) {
    let toggle = 'hover';
    const p = createProxy<any>();

    if (get(item, p.toggle) === 'click') {
      toggle = 'click';
    } else if (get(item, p.submenu.type) === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  disableScroll() {
    return this.layoutConfigService.getConfigValue('asideMenuDropdown') || false;
  }

}
