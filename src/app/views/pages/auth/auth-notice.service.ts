import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthNotice } from './_interfaces/auth-notice.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthNoticeService {

  onNoticeChanged$: BehaviorSubject<AuthNotice | undefined>;

  constructor() {
    this.onNoticeChanged$ = new BehaviorSubject<AuthNotice | undefined>(undefined);
  }

  setNotice(message?: string, type?: string) {
    const notice: AuthNotice = { message, type };
    this.onNoticeChanged$.next(notice);
  }

  resetNotice() {
    this.onNoticeChanged$.next(undefined);
  }
}
