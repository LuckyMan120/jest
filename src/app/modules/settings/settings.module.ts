import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../category/category.service';
import { SharedModule } from './../../shared/shared.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { LayoutComponent } from './layout/layout.component';
import { SettingService } from './setting.service';
import { settingsRoutes } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatOptionModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    RouterModule.forChild(settingsRoutes),
    SharedModule
  ],
  declarations: [
    LayoutComponent,
    SettingsComponent,
    ConfigurationComponent
  ],
  providers: [
    CategoryService,
    SettingService
  ]
})
export class SettingsModule {
}
