import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgPipesModule } from 'ngx-pipes';
import { ProfileService } from './../../services/profile.service';
import { PortletModule } from './../portlet/portlet.module';
import { BirthdayListComponent } from './birthday-list/birthday-list.component';

@NgModule({
  imports: [
    CommonModule,
    TabsModule,
    NgPipesModule,
    PortletModule,
    RouterModule
  ],
  exports: [
    BirthdayListComponent
  ],
  declarations: [
    BirthdayListComponent
  ],
  providers: [
    ProfileService
  ]
})
export class BirthdayModule {
}
