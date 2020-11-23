import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-portlet-footer',
  template: `<ng-content></ng-content>`
})
export class PortletFooterComponent implements OnInit {

  @HostBinding('class') classList = 'app-portlet__foot';
  @Input() class!: string;

  ngOnInit() {
    if (this.class) {
      this.classList += ' ' + this.class;
    }
  }
}
