import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { Router, RouterModule, Routes } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';


const routes: Routes = [{ path: 'shell', component: AppShellComponent }];

@NgModule({
  imports: [AppModule, ServerModule, RouterModule.forRoot(routes)],
  bootstrap: [AppComponent],
  declarations: [AppShellComponent],
})
export class AppServerModule {
  // BUG: https://github.com/angular/angular-cli/issues/8929
  constructor(private router: Router) {
    this.router.resetConfig(routes);
  }
}
