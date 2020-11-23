import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

export interface Widget4Data {
  id?: string;
  icon?: string;
  pic?: string;
  title?: string;
  username?: string;
  desc?: string;
  url?: string;
  type?: string;
}

@Component({
  selector: 'app-widget4',
  templateUrl: './widget4.component.html',
  styleUrls: ['./widget4.component.scss']
})
export class Widget4Component implements OnInit {

  @Input() data!: Widget4Data[];
  @Input() edit = false;

  @ContentChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  constructor() {
  }

  ngOnInit() {
  }

}
