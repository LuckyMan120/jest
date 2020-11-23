import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApplicationService } from './../../../../modules/settings/application.service';
import { Application } from './../../../../modules/settings/_interfaces/application.interface';
import { AuthNoticeService } from './../auth-notice.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit {

  application$!: Observable<Application | undefined>;

  constructor(
    private authNoticeService: AuthNoticeService,
    private applicationService: ApplicationService
  ) {
    this.authNoticeService.onNoticeChanged$.pipe(
      tap((notice: any) => notice ? this.authNoticeService.setNotice(notice.code, notice.color) : null)
    );
  }

  ngOnInit(): void {
    this.authNoticeService.setNotice('Du hast keine Berechtigung zum Aufruf dieser Seite!', 'danger');
    this.application$ = this.applicationService.getCurrentApplication();
  }

}
