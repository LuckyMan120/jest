import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createProxy, get } from 'ts-object-path';
import { MenuConfigService } from './menu-config.service';

@Injectable()
export class MenuHorizontalService {

  menuList$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private menuConfigService: MenuConfigService) {
    this.loadMenu();
  }

  loadMenu() {
    const p = createProxy<any>();
    const menuItems = get(this.menuConfigService.getMenus(), p.header.items);
    this.menuList$.next(menuItems);
  }
}
