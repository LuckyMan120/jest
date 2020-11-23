import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutConfigService } from './../../../../shared/services/layout-config.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorPageComponent implements OnInit, OnDestroy {

  @Input() type = 'error-v1';
  @Input() image!: string;
  @Input() code = '404';
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() desc = 'Oops! Something went wrong!';
  @Input() return = 'Return back';

  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private layoutConfigService: LayoutConfigService
  ) {
    this.layoutConfigService.setConfig('selfLayout', 'blank', false);
  }

  ngOnInit() {
    this.sub = this.route.data.subscribe(param => {
      if (param) {
        this.type = param.type;
        this.code = param.code;
        this.title = param.title;
        this.desc = param.desc;
      }
    });

    this.image = './assets/media/error/bg5.jpg';
  }

  ngOnDestroy(): void {
    this.layoutConfigService.reloadConfigs();
    this.sub.unsubscribe();
  }
}
