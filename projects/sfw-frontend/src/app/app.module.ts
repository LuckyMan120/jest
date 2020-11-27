import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFirestoreModule, USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ThemeModule } from './theme/theme.module';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserAuthCreateComponent } from './user-auth-create/user-auth-create.component';
registerLocaleData(localeDe, localeDeExtra);

@NgModule({
  declarations: [AppComponent, UserCreateComponent, UserDeleteComponent, UserUpdateComponent, UserAuthCreateComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'sfw-frontend' }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFireAnalyticsModule,
    // AngularFirePerformanceModule,
    // AngularFireMessagingModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireStorageModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
    RouterModule,
    BrowserAnimationsModule,
    ThemeModule
  ],
  providers: [
    UserTrackingService,
    ScreenTrackingService,
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 8080] : undefined },
    { provide: LOCALE_ID, useValue: 'de' }
    // { provide: ANALYTICS_DEBUG_MODE, useFactory: () => isDevMode() },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
