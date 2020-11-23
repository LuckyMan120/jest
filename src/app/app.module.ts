import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { APP_INITIALIZER, isDevMode, LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, USE_DEVICE_LANGUAGE, USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { AngularFirestoreModule, USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { NEW_ORIGIN_BEHAVIOR, ORIGIN as FUNCTIONS_ORIGIN, USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/functions';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutConfig } from './shared/config/layout.config';
import { LayoutConfigService } from './shared/services/layout-config.service';
import { SeoService } from './shared/services/seo.service';
import { SplashScreenService } from './shared/services/splash-screen.service';
import { SplashScreenComponent } from './views/themes/default/splash-screen/splash-screen.component';
registerLocaleData(localeDe, localeDeExtra);

export function initializeConfig(layoutConfig: LayoutConfig, layoutConfigService: LayoutConfigService) {
  return () => layoutConfigService.loadConfig(layoutConfig.backendConfigs);
}

@NgModule({
  declarations: [
    AppComponent,
    SplashScreenComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'sfw-backend' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    BrowserAnimationsModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // ReactiveFormsModule,
    // BsDropdownModule.forRoot(),
    // MatSelectModule,
    // TabsModule.forRoot(),
    // TooltipModule.forRoot(),
    // MatProgressSpinnerModule
  ],
  providers: [
    // AuthService,
    LayoutConfig,
    LayoutConfigService,
    SeoService,
    SplashScreenService,
    { provide: USE_AUTH_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9099] : undefined },
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 8080] : undefined },
    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useEmulators ? ['localhost', 5001] : undefined },
    { provide: NEW_ORIGIN_BEHAVIOR, useValue: true },
    { provide: FUNCTIONS_ORIGIN, useFactory: () => isDevMode() ? undefined : 'europe-west1' },
    { provide: USE_DEVICE_LANGUAGE, useValue: true },
    { provide: APP_INITIALIZER, useFactory: initializeConfig, deps: [LayoutConfig, LayoutConfigService], multi: true },
    { provide: LOCALE_ID, useValue: 'de' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
