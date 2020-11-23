import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-portlet-body',
  template: `
		<ng-content></ng-content>`
})
export class PortletBodyComponent implements OnInit {

  @HostBinding('class') classList = 'app-portlet__body';
  @Input() class!: string;

  ngOnInit() {
    if (this.class) {
      this.classList += ' ' + this.class;
    }
  }

}
