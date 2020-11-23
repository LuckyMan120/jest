// Angular
import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

export interface OffcanvasOptions {
  baseClass: string;
  overlay?: boolean;
  closeBy: string;
  toggleBy?: any;
}

@Directive({
  // eslint-disable-next-line
  selector: '[offCanvas]',
  exportAs: 'offCanvas',
})
export class OffcanvasDirective implements AfterViewInit {

  @Input() options!: OffcanvasOptions;
  private offCanvas: any;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.offCanvas = new KTOffcanvas(this.el.nativeElement, this.options);
    });
  }

  getOffcanvas() {
    return this.offCanvas;
  }
}
