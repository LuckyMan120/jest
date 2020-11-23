import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../../../modules/user/_interfaces/user.interface';
import { AuthNoticeService } from '../auth-notice.service';
import { AuthService } from '../auth.service';
import { GlobalAuthService } from './../global-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;

  user$: Observable<User | null>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private authNoticeService: AuthNoticeService,
    private authService: AuthService,
    private globalAuthService: GlobalAuthService
  ) {
    this.user$ = this.authService.authUser$;
    this.authNoticeService.onNoticeChanged$.pipe(
      tap((notice: any) => notice ? this.authNoticeService.setNotice(notice.code, notice.color) : null));
  }

  ngOnInit(): void {
    this.loginForm = this.globalAuthService.initLoginForm();
  }

  ngOnDestroy(): void {
    this.authNoticeService.setNotice();
  }

  async onSubmit(): Promise<void> {
    const controls = this.loginForm.controls;
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.isLoading$.next(true);

    const credentials: { email: string, password: string, rememberMe: boolean } = {
      email: controls.email.value,
      password: controls.password.value,
      rememberMe: controls.rememberMe.value
    };

    try {
      await this.authService.signIn(credentials);
      this.redirectToDashboard();
    } catch (err) {
      this.authNoticeService.setNotice(`Es ist ein Fehler aufgetreten: (${err.code})`, 'danger');
      this.isLoading$.next(false);
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  async googleLogin(): Promise<void> {
    try {
      await this.authService.doGoogleLogin()
      this.redirectToDashboard();
    } catch (e) {
      this.authNoticeService.setNotice(e.code, 'danger');
    }
  }

  async facebookLogin(): Promise<void> {
    try {
      await this.authService.doFacebookLogin();
      this.redirectToDashboard();
    } catch (e) {
      this.authNoticeService.setNotice(e.code, 'danger');
    }
  }

  async twitterLogin(): Promise<void> {
    try {
      await this.authService.doTwitterLogin();
      this.redirectToDashboard();
    } catch (e) {
      this.authNoticeService.setNotice(e.code, 'danger');
    }
  }

  redirectToDashboard() {
    return this.router.navigate(['/start/dashboard']);
  }

}
