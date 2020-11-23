import { Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';
import { LayoutComponent } from './layout/layout.component';
import { SettingsComponent } from './settings/settings.component';

export const settingsRoutes: Routes = [
  {
    path: 'application',
    component: SettingsComponent
  },
  {
    path: 'configuration',
    component: ConfigurationComponent
  },
  {
    path: 'layout',
    component: LayoutComponent
  },
  {
    path: '**',
    redirectTo: 'application'
  }
];
