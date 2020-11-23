import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { createProxy, get, set } from 'ts-object-path';

export interface MenuOptions {
  scroll?: any;
  submenu?: any;
  accordion?: any;
}

@Directive({
  selector: '[menu]',
  exportAs: 'menu',
})
export class MenuDirective implements AfterViewInit {

  @Input() options!: MenuOptions;
  private menu: any;

  constructor(
    private el: ElementRef
  ) {
  }

  ngAfterViewInit(): void {
    this.setupOptions();
    this.menu = new KTMenu(this.el.nativeElement, this.options);
  }

  getMenu() {
    return this.menu;
  }

  private setupOptions() {
    // init aside menu
    let menuDesktopMode = 'accordion';
    if (this.el.nativeElement.getAttribute('data-menu-dropdown') === '1') {
      menuDesktopMode = 'dropdown';
    }

    const p = createProxy<any>();
    if (typeof get(this.options, p.submenu.desktop) === 'object') {
      set(this.options, (s: any) => s.submenu.desktop.default, menuDesktopMode);
    }
  }
}
