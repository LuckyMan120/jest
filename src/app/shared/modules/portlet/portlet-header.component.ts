import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DialogService } from './../../../shared/services/dialog.service';

@Component({
  selector: 'app-portlet-header',
  styleUrls: ['portlet-header.component.scss'],
  templateUrl: './portlet-header.component.html'
})
export class PortletHeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() class!: string;
  @Input() title!: string;
  @Input() desc!: string;
  @Input() icon!: string;
  @Input() noTitle!: boolean;
  @Input() sticky!: boolean;
  @Input() viewLoading$!: Observable<boolean>;
  viewLoading = false;

  @HostBinding('class') classes = 'app-portlet__head';

  @ViewChild('refIcon', { static: true }) refIcon!: ElementRef;
  hideIcon!: boolean;

  @ViewChild('refTools', { static: true }) refTools!: ElementRef;
  hideTools!: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    private DialogService: DialogService
  ) {
  }

  ngOnInit() {
    this.classes += this.class ? ' ' + this.class : '';
  }

  ngAfterViewInit(): void {
    if (this.viewLoading$) {
      const loadingSubscription = this.viewLoading$.subscribe(res => this.toggleLoading(res));
      this.subscriptions.push(loadingSubscription);
    }
    this.hideIcon = this.refIcon.nativeElement.children.length === 0;
    this.hideTools = this.refTools.nativeElement.children.length === 0;
  }

  toggleLoading(incomingValue: boolean) {
    this.viewLoading = incomingValue;
    if (incomingValue && !this.DialogService.checkIsShown()) {
      this.DialogService.show();
    }

    if (!this.viewLoading && this.DialogService.checkIsShown()) {
      this.DialogService.hide();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
