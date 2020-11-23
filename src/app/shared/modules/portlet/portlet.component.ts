import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Observable } from 'rxjs';
import { PortletBodyComponent } from './portlet-body.component';
import { PortletFooterComponent } from './portlet-footer.component';
import { PortletHeaderComponent } from './portlet-header.component';

export interface PortletOptions {
  test?: any;
}

@Component({
  selector: 'app-portlet',
  templateUrl: './portlet.component.html',
  // exportAs: 'app-portlet'
})
export class PortletComponent {
  @Input() loading$!: Observable<boolean>;
  @Input() options!: PortletOptions;
  @Input() class!: string;

  @ViewChild('refPortlet', { static: true }) refPortlet!: ElementRef;

  @ViewChild(PortletHeaderComponent, { static: true }) header!: PortletHeaderComponent;
  @ViewChild(PortletBodyComponent, { static: true }) body!: PortletBodyComponent;
  @ViewChild(PortletFooterComponent, { static: true }) footer!: PortletFooterComponent;

  constructor(
    public loader: LoadingBarService
  ) {
    const state = this.loader.useRef('router');
    state.complete();
  }

}
