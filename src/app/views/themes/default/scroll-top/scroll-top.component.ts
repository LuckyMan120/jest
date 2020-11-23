import { Component } from '@angular/core';
import { ScrollTopOptions } from './../../../../shared/directives/scroll-top.directive';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
})
export class ScrollTopComponent {

  scrollTopOptions: ScrollTopOptions = {
    offset: 300,
    speed: 600
  };

}
