import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

export interface ScrollTopOptions {
  offset: number;
  speed: number;
}

@Directive({
  selector: '[scrollTop]'
})
export class ScrollTopDirective implements AfterViewInit {

  @Input() options!: ScrollTopOptions;
  private scrollTop: any;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.scrollTop = new KTScrolltop(this.el.nativeElement, this.options);
  }

  getScrollTop() {
    return this.scrollTop;
  }
}
