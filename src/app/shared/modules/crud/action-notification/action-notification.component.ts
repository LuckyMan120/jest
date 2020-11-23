import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MessageType } from './../../../../shared/services/layout-utils.service';

@Component({
  selector: 'app-action-notification',
  templateUrl: './action-notification.component.html',
  changeDetection: ChangeDetectionStrategy.Default

})
export class ActionNotificationComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {
    color: string;
    showUndoButton: boolean;
    duration: number;
    undoButtonDuration: number;
    snackBar: MatSnackBar;
    message: string;
    type: MessageType;
    showCloseButton: boolean;
    verticalPosition: string;
  }) {
  }

  ngOnInit() {
    if (!this.data.showUndoButton || (this.data.undoButtonDuration >= this.data.duration)) {
      return;
    }

    this.delayForUndoButton(this.data.undoButtonDuration).subscribe(() => {
      this.data.showUndoButton = false;
    });
  }

  delayForUndoButton(timeToDelay: number) {
    return of('').pipe(delay(timeToDelay));
  }

  onDismissWithAction() {
    this.data.snackBar.dismiss();
  }

  public onDismiss() {
    this.data.snackBar.dismiss();
  }
}
