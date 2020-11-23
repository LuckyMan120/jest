import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { set } from 'ts-object-path';

export interface HeaderOptions {
  classic?: any;
  offset?: any;
  minimize?: any;
}

@Directive({
  selector: '[header]',
  exportAs: 'header',
})
export class HeaderDirective implements AfterViewInit {

  @Input() options: HeaderOptions = {};

  constructor(
    private el: ElementRef
  ) {
  }

  ngAfterViewInit(): void {
    this.setupOptions();
    const header = new KTHeader(this.el.nativeElement, this.options);
  }

  private setupOptions() {
    if (this.el.nativeElement.getAttribute('data-header-minimize') === '1') {
      set(this.options, (p: any) => p['minimize.desktop.on'], 'app-header--minimize');
      set(this.options, (p: any) => p['offset.desktop'], 150);
    }
  }
}
