import { ChangeDetectorRef, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthNoticeService } from '../auth-notice.service';
import { AuthNotice } from '../_interfaces/auth-notice.interface';

@Component({
  selector: 'app-auth-notice',
  templateUrl: './auth-notice.component.html',
})
export class AuthNoticeComponent implements OnInit, OnDestroy {

  @Output() type: any;
  @Output() msg: any = '';
  @Output() code: any;

  private sub!: Subscription;

  constructor(
    public authNoticeService: AuthNoticeService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.sub = this.authNoticeService.onNoticeChanged$.subscribe((notice: AuthNotice | undefined) => {
      notice = Object.assign({}, { message: '', type: '' }, notice);
      this.msg = notice.message;
      this.code = notice.code;
      this.type = notice.type;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
