import { NgModule } from '@angular/core';
import { ContentAnimateDirective } from './directives/content-animate.directive';
import { HeaderDirective } from './directives/header.directive';
import { MenuDirective } from './directives/menu.directive';
import { OffcanvasDirective } from './directives/offcanvas.directive';
import { ScrollTopDirective } from './directives/scroll-top.directive';
import { StickyDirective } from './directives/sticky.directive';
import { TabClickEventDirective } from './directives/tab-click-event.directive';
import { ToggleDirective } from './directives/toggle.directive';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [
    OffcanvasDirective,
    ScrollTopDirective,
    ToggleDirective,
    MenuDirective,
    HeaderDirective,
    ContentAnimateDirective,
    TabClickEventDirective,
    StickyDirective,
    FirstLetterPipe,
    TimeAgoPipe,
  ],
  exports: [
    OffcanvasDirective,
    ScrollTopDirective,
    ToggleDirective,
    MenuDirective,
    ContentAnimateDirective,
    FirstLetterPipe,
    HeaderDirective,
    TabClickEventDirective,
    StickyDirective,
    TimeAgoPipe
  ]
})
export class CoreModule {
}
