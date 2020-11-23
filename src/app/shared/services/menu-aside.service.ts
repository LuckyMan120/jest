import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createProxy, get } from 'ts-object-path';
import { Permission } from './../../modules/permission/_interfaces/permission.interface';
import { Role } from './../../modules/role/_interfaces/role.interface';
import { User } from './../../modules/user/_interfaces/user.interface';
import { AuthService } from './../../views/pages/auth/auth.service';
import { FirestoreService } from './firestore.service';
import { MenuConfigService } from './menu-config.service';

@Injectable()
export class MenuAsideService {

  classes!: string;

  menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  roles$!: Observable<Role[]>;
  permissions$!: Observable<Permission[]>;

  constructor(
    private menuConfigService: MenuConfigService,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
  }

  loadMenu() {
    const p = createProxy<any>();
    const menuItems: any[] = get(this.menuConfigService.getMenus(), p.aside.items);
    this.menuList$.next(menuItems);

    this.roles$ = this.firestoreService.col<Role>(`roles`).valueChanges();
    this.permissions$ = this.firestoreService.col<Permission>(`permissions`).valueChanges();

    return combineLatest([
      this.menuList$,
      this.roles$,
      this.permissions$,
      this.authService.authUser$
    ]).pipe(
      map(([menuList, roles, permissions, user]) => this.checkMenuItemPermissions(menuList, roles, permissions, user))
    );
  }

  checkMenuItemPermissions(menuList: any[], roles: Role[], permissions: Permission[], user: User) {
    return menuList.map((menuItem: any) => {
      if (!menuItem.permissions || this.authService.checkPermissions(user, roles, permissions, menuItem.permissions)) {
        if (menuItem.submenu) {
          menuItem.submenu = this.checkMenuItemPermissions(menuItem.submenu, roles, permissions, user);
        }
        return menuItem;
      }
    }).filter(m => !!m);
  }
}
