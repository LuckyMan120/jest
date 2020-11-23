import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { GeneralModule } from '../../../shared/modules/general/general.module';
import { HtmlClassService } from '../../../shared/services/html-class.service';
import { CoreModule } from './../../../shared/core.module';
import { AuthGuard } from './../../../shared/guards/auth.guard';
import { DialogService } from './../../../shared/services/dialog.service';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { LayoutRefService } from './../../../shared/services/layout-ref.service';
import { LayoutUtilsService } from './../../../shared/services/layout-utils.service';
import { MenuAsideService } from './../../../shared/services/menu-aside.service';
import { MenuConfigService } from './../../../shared/services/menu-config.service';
import { MenuHorizontalService } from './../../../shared/services/menu-horizontal.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { PaginatorTranslationIntl } from './../../../shared/services/paginator-translation.service';
import { AuthService } from './../../pages/auth/auth.service';
import { AsideLeftComponent } from './aside/aside-left.component';
import { BaseComponent } from './base/base.component';
import { BrandComponent } from './brand/brand.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderMobileComponent } from './header/header-mobile/header-mobile.component';
import { HeaderComponent } from './header/header.component';
import { MenuHorizontalComponent } from './header/menu-horizontal/menu-horizontal.component';
import { TopbarComponent } from './header/topbar/topbar.component';
import { UserProfileComponent } from './header/user-profile/user-profile.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { SubheaderComponent } from './subheader/subheader.component';

export const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelSpeed: 0.5,
  swipeEasing: true,
  minScrollbarLength: 40,
  maxScrollbarLength: 300,
};

@NgModule({
  declarations: [
    AsideLeftComponent,
    BaseComponent,
    BrandComponent,
    ErrorPageComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMobileComponent,
    MenuHorizontalComponent,
    ScrollTopComponent,
    SubheaderComponent,
    TopbarComponent,
    UserProfileComponent,
  ],
  exports: [
    AsideLeftComponent,
    BaseComponent,
    BrandComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMobileComponent,
    MenuHorizontalComponent,
    ScrollTopComponent,
    SubheaderComponent,
    TopbarComponent,
    UserProfileComponent,
  ],
  providers: [
    AuthGuard,
    AuthService,
    DialogService,
    FirestoreService,
    HtmlClassService,
    LayoutRefService,
    LayoutUtilsService,
    MatDialog,
    MenuAsideService,
    MenuConfigService,
    MenuHorizontalService,
    NotificationService,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: MatPaginatorIntl, useClass: PaginatorTranslationIntl },
    /*
    // CalendarService,
    PageConfigService,
    SubheaderService,
    */
  ],
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    CoreModule,
    GeneralModule,
    LoadingBarRouterModule,
    MatDialogModule,
    MatSnackBarModule,
    PagesRoutingModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    /*
    CrudModule,
    HttpClientModule,
    /* InlineSVGModule,
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule, */
  ]
})
export class ThemeModule {
}
