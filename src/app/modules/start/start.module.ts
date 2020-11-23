import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SocialLoginModule } from 'angularx-social-login';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { WidgetModule } from '../../shared/modules/widgets/widget.module';
import { SharedModule } from '../../shared/shared.module';
import { BirthdayModule } from './../../shared/modules/birthday/birthday.module';
import { SharedArticleModule } from './../article/shared-article.module';
import { ApplicationService } from './../settings/application.service';
import { CalendarEventComponent } from './dashboard/calendar-event/calendar-event.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LatestActivitiesComponent } from './dashboard/latest-activities/latest-activities.component';
import { SocialPostComponent } from './dashboard/social-post/social-post.component';
import { startRoutes } from './start.routing';
import { StartService } from './start.service';
import { StartComponent } from './start/start.component';


export async function inititSocialAuthConfig(
  applicationService: ApplicationService
) {
  const cfg = await applicationService.getConfig().toPromise();
  console.log(cfg);
  /*.pipe(
    take(1),
    tap(cfg => {
      let providers: { id: string; provider: any }[] = [];
      if (cfg && cfg.socialProviders) {
        providers = cfg.socialProviders.map(p => {
          return p.type === 'facebook'

            ? { id: FacebookLoginProvider.PROVIDER_ID, provider: new FacebookLoginProvider(p.clientId,
              { scope: 'manage_pages,publish_pages', version: 'v7.0' }) }
            : { id: GoogleLoginProvider.PROVIDER_ID, provider: new GoogleLoginProvider(p.clientId) };
        });
      }
      console.log(providers);
      return { autoLogin: false, providers } as SocialAuthServiceConfig;
    })
  );*/
}

@NgModule({
  imports: [
    AngularFireFunctionsModule,
    AngularFireAuthModule,
    BirthdayModule,
    CommonModule,
    MatCheckboxModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule,
    MatRadioModule,
    TabsModule,
    SocialLoginModule,
    RouterModule.forChild(startRoutes),
    SharedModule,
    SharedArticleModule,
    WidgetModule
  ],
  providers: [
    StartService,
    {
      provide: 'SocialAuthServiceConfig',
      useFactory: inititSocialAuthConfig,
      deps: [ApplicationService],
      // multi: true
    }
  ],
  declarations: [
    DashboardComponent,
    LatestActivitiesComponent,
    SocialPostComponent,
    CalendarEventComponent,
    StartComponent
  ]
})
export class StartModule {
}
