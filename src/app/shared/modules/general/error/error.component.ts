import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

  @Input() type = 'error-v1';
  @Input() image!: string;
  @Input() code = '404';
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() desc = 'Oops! Something went wrong!';
  @Input() return = 'Return back';

  @HostBinding('class') classes = 'app-grid app-grid--ver app-grid--root';
}
