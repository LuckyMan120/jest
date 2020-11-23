import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoreModule } from './../../../shared/core.module';
import { DialogService } from './../../../shared/services/dialog.service';
import { PortletBodyComponent } from './portlet-body.component';
import { PortletFooterComponent } from './portlet-footer.component';
import { PortletHeaderComponent } from './portlet-header.component';
import { PortletComponent } from './portlet.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  declarations: [
    PortletComponent,
    PortletHeaderComponent,
    PortletBodyComponent,
    PortletFooterComponent,
  ],
  exports: [
    PortletComponent,
    PortletHeaderComponent,
    PortletBodyComponent,
    PortletFooterComponent
  ],
  providers: [
    DialogService
  ]
})
export class PortletModule {
}
