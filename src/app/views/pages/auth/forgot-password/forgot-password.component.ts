import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthNoticeService } from '../auth-notice.service';
import { AuthService } from './../auth.service';
import { GlobalAuthService } from './../global-auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private authNoticeService: AuthNoticeService,
    private authService: AuthService,
    private globalAuthService: GlobalAuthService
  ) {
  }

  ngOnInit() {
    this.form = this.globalAuthService.initForgotPasswordForm();
  }

  ngOnDestroy(): void {
    this.authNoticeService.setNotice();
  }

  onSubmit() {
    this.isLoading$.next(true);
    const controls = this.form.controls;
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    const email = controls.email.value;

    this.authService.requestPassword(email)
      .then(() => this.authNoticeService.setNotice(
        `Falls Du die korrekte E-Mail Adresse angegeben hast, wird Dir
        in wenigen Sekunden eine E-Mail mit neuen Daten gesendet`,
        'success')
      )
      .catch((err: any) => this.authNoticeService.setNotice(`Es ist ein Fehler aufgetreten (${err.code})`, 'danger'))
      .finally(() => this.isLoading$.next(false));
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty || control.touched);
  }
}
