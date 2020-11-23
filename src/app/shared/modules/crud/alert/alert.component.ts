import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {

  @Input() type = 'primary | secondary | success | warning | danger | info | light | dark';
  @Input() duration = 0;
  @Input() showCloseButton = true;
  @Output() closing = new EventEmitter<boolean>(false);

  alertShowing = true;

  ngOnInit() {
    if (this.duration === 0) {
      return;
    }

    setTimeout(() => {
      this.closeAlert();
    }, this.duration);
  }

  closeAlert() {
    this.closing.emit();
  }
}
