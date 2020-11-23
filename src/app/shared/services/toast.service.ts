import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const isE2E = window.location.search.includes('e2e');

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(public snackBar: MatSnackBar) {
  }

  openSnackBar(message: string, action: string) {
    if (isE2E) {
      console.log(`${message} - ${action}`);
    } else {
      this.snackBar.open(message, action, {
        duration: 2000
      });
    }
  }
}
