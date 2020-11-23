import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Article } from '../../../../modules/article/_interfaces/article.interface';
import { ApplicationService } from '../../../../modules/settings/application.service';
import { AuthNoticeService } from '../auth-notice.service';
import { AuthService } from '../auth.service';
import { Application } from './../../../../modules/settings/_interfaces/application.interface';
import { ArticleDialogComponent } from './../article-dialog/article-dialog.component';
import { GlobalAuthService } from './../global-auth.service';
import { AuthRegisterUser } from './../_interfaces/auth-register-user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {

  length3 = 3;
  length100 = 100;
  length320 = 320;

  showForm = true;
  registerForm!: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  application$!: Observable<Application | undefined>;
  privacy$!: Observable<Article | undefined>;

  constructor(
    private authNoticeService: AuthNoticeService,
    private authService: AuthService,
    private globalAuthService: GlobalAuthService,
    private applicationService: ApplicationService,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.registerForm = this.globalAuthService.initRegistrationForm();
    this.application$ = this.applicationService.getCurrentApplication().pipe(
      tap((application: Application | undefined) =>
        !application?.registration.isEnabled
          ? this.authNoticeService.setNotice('AUTH.REGISTER.DISABLED', 'danger')
          : null
      )
    );
    this.privacy$ = this.applicationService.getArticle('nutzungsbedingungen').pipe(
      tap((article) => {
        if (article) {
          this.registerForm.get('agree')?.setValidators([Validators.required]);
          this.registerForm.get('agree')?.setValue(false);
        }
      })
    );

    this.authNoticeService.onNoticeChanged$.pipe(
      tap((notice: any) => notice ? this.authNoticeService.setNotice(notice.code, notice.color) : null));
  }

  async onSubmit() {
    this.isLoading$.next(true);
    const controls = this.registerForm.controls;

    if (this.registerForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.isLoading$.next(false);
      return;
    }

    if (!controls.agree.value) {
      this.authNoticeService.setNotice('AUTH.VALIDATION.ACCEPTTERMS', 'danger');
      this.isLoading$.next(false);
      return;
    }

    const user: AuthRegisterUser = {
      email: controls.email.value,
      displayName: controls.displayName.value,
      firstName: controls.firstName.value,
      lastName: controls.lastName.value,
      password: controls.password.value
    };

    try {
      await this.authService.register(user);

      this.authNoticeService.setNotice(
        `Deine Registrierung war erfolgreich. Bitte überprüfe Dein Mailpostfach.`,
        'success');
      await this.authService.logout();
      this.router.navigate(['/auth/login']);

    } catch (err) {
      this.authNoticeService.setNotice(`Es ist ein Fehler aufgetreten (${err.code})`, 'danger');
      this.isLoading$.next(false);
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.registerForm.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  resetAuthMessage() {
    this.authNoticeService.resetNotice();
  }

  showArticle(article: Article) {
    return this.dialog.open(ArticleDialogComponent, {
      data: article,
      width: '80vw'
    });
  }
}
