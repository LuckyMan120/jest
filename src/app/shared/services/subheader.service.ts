import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { createProxy, get } from 'ts-object-path';
import { MenuConfigService } from './menu-config.service';
import { PageConfigService } from './page-config.service';

export interface Breadcrumb {
  title: string;
  page: string | any;
  queryParams: any;
}

export interface BreadcrumbTitle {
  title: string;
  desc?: string;
  showToolbar?: boolean;
  link?: {
    url?: string;
    title?: string;
    text?: string;
  };
}

@Injectable()
export class SubheaderService {

  title$: BehaviorSubject<BreadcrumbTitle> = new BehaviorSubject<BreadcrumbTitle>({ title: '', desc: '', showToolbar: true, link: {} });
  breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);
  disabled$: Subject<boolean> = new Subject<boolean>();

  private manualBreadcrumbs: any = {};
  private appendingBreadcrumbs: any = {};
  private manualTitle: any = {};

  private asideMenus: any;
  private headerMenus: any;
  private pageConfig: any;

  constructor(
    private router: Router,
    private pageConfigService: PageConfigService,
    private menuConfigService: MenuConfigService) {
    const initBreadcrumb = () => {
      this.pageConfig = this.pageConfigService.getCurrentPageConfig();


      const p = createProxy<any>();
      this.headerMenus = get(this.menuConfigService.getMenus(), p.header);
      this.asideMenus = get(this.menuConfigService.getMenus(), p.aside);

      this.updateBreadcrumbs();

      if (get(this.manualTitle, this.router.url)) {
        this.setTitle(this.manualTitle[this.router.url]);
      } else {
        // get updated page title on every route changed
        this.title$.next(get(this.pageConfig, p.page));

        // subheader enable/disable
        const hideSubheader = get(this.pageConfig, p.page.subheader);
        this.disabled$.next(typeof hideSubheader !== 'undefined' && !hideSubheader);

        if (get(this.manualBreadcrumbs, p[this.router.url])) {
          // breadcrumbs was set manually
          this.setBreadcrumbs(this.manualBreadcrumbs[this.router.url]);
        } else {
          // get updated breadcrumbs on every route changed
          this.updateBreadcrumbs();
          // breadcrumbs was appended before, reuse it for this page
          if (get(this.appendingBreadcrumbs, p[this.router.url])) {
            this.appendBreadcrumbs(this.appendingBreadcrumbs[this.router.url]);
          }
        }
      }
    };

    initBreadcrumb();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(initBreadcrumb);
  }

  updateBreadcrumbs() {
    // get breadcrumbs from header menu
    let breadcrumbs = this.getBreadcrumbs(this.headerMenus);
    // if breadcrumbs empty from header menu
    if (breadcrumbs.length === 0) {
      // get breadcrumbs from aside menu
      breadcrumbs = this.getBreadcrumbs(this.asideMenus);
    }

    const p = createProxy<any>();

    if (
      // if breadcrumb has only 1 item
      breadcrumbs.length === 1 &&
      // and breadcrumb title is same as current page title
      breadcrumbs[0].title.indexOf(get(this.pageConfig, p.page.title)) !== -1) {
      // no need to display on frontend
      breadcrumbs = [];
    }

    this.breadcrumbs$.next(breadcrumbs);
  }

  setBreadcrumbs(breadcrumbs: Breadcrumb[] | any[]) {
    this.manualBreadcrumbs[this.router.url] = breadcrumbs;
    this.breadcrumbs$.next(breadcrumbs);
  }

  appendBreadcrumbs(breadcrumbs: Breadcrumb[] | any[]) {
    this.appendingBreadcrumbs[this.router.url] = breadcrumbs;
    const prev = this.breadcrumbs$.getValue();
    this.breadcrumbs$.next(prev.concat(breadcrumbs));
  }

  getBreadcrumbs(menus: any) {
    let url = this.router.url;

    // remove first route (demo name) from url router
    if (new RegExp(/^\/de/).test(url)) {
      const urls = url.split('/');
      urls.splice(0, 2);
      url = urls.join('/');
    }

    const breadcrumbs: any[] = [];
    const menuPath = this.getPath(menus, url);
    menuPath.forEach(key => {
      menus = menus[key];
      if (typeof menus !== 'undefined' && menus.title) {
        breadcrumbs.push(menus);
      }
    });
    return breadcrumbs;
  }

  setTitle(page: string | { title: string, desc: string, showToolbar?: boolean, link?: {} }) {
    if (typeof page === 'string') {
      this.manualTitle[this.router.url] = page;
      this.title$.next({ title: page });
    } else {
      this.manualTitle[this.router.url] = page.title;
      this.title$.next({ title: page.title, desc: page.desc, showToolbar: page.showToolbar, link: page.link });
    }
  }

  getPath(obj: any, value: any) {
    if (typeof obj !== 'object') {
      throw new TypeError('Can only operate on Array or Object');
    }
    const path: any[] = [];
    let found = false;

    const search = (haystack: any) => {
      for (const key in haystack) {
        path.push(key);
        if (haystack[key] === value) {
          found = true;
          break;
        }
        if (typeof haystack[key] === 'object') {
          search(haystack[key]);
          if (found) {
            break;
          }
        }
        path.pop();
      }
    };

    search(obj);
    return path;
  }
}
