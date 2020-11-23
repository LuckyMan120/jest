import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DialogService {

  private Dialog: any;
  private currentState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.Dialog = new KTDialog({ type: 'loader', placement: 'top center', message: 'Loading ...' });
  }

  show() {
    this.currentState.next(true);
    this.Dialog.show();
  }

  hide() {
    this.currentState.next(false);
    this.Dialog.hide();
  }

  checkIsShown() {
    return this.currentState.value;
  }
}
