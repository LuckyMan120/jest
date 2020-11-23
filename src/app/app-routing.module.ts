import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  { path: 'setup', loadChildren: () => import('./views/pages/setup/setup.module').then(m => m.SetupModule) },
  { path: '', loadChildren: () => import('./views/themes/default/theme.module').then(m => m.ThemeModule) },
  {
    path: '**',
    redirectTo: 'auth',
    // pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: environment.routerTracing,
      // initialNavigation: 'enabledNonBlocking', => default since v11
      // relativeLinkResolution: 'corrected' => default since v11
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
