import { Directive, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tabClickEvent]'
})
export class TabClickEventDirective {

  constructor(
    private render: Renderer2
  ) { }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {

    const parent = target.closest('[role="tablist"]');
    const activeLink = parent?.querySelector('[role="tab"].active');
    if (activeLink) {
      this.render.removeClass(activeLink, 'active');
    }

    const link = target.closest('[role="tab"]');
    if (link) {
      this.render.addClass(link, 'active');
    }
  }
}
