import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeComponent implements OnInit {

  @Input() classes: any = '';
  @Input() icon: any;

  constructor() { }

  ngOnInit() {
    if (this.icon) {
      this.classes += ' app-alert--icon';
    }
  }

}
