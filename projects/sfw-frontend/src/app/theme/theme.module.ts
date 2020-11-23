import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { BaseComponent } from './base/base.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ThemeRoutingModule } from './theme-routing.module';
import { ThemeService } from './theme.service';

@NgModule({
  declarations: [
    BaseComponent,
    FooterComponent,
    HeaderComponent
  ],
  exports: [
    BaseComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ThemeRoutingModule
  ],
  providers: [
    ThemeService
  ]
})
export class ThemeModule { }
