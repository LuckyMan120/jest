import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthNoticeService } from './../auth-notice.service';
import { AuthService } from './../auth.service';
import { GlobalAuthService } from './../global-auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  public verifyForm!: FormGroup;
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public displayProceedLink = false;

  private unsubscribe: Subscription[] = [];

  constructor(
    private authNoticeService: AuthNoticeService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private globalAuthService: GlobalAuthService,
    private router: Router
  ) {
    this.authNoticeService.onNoticeChanged$.pipe(
      tap((notice: any) => notice ? this.authNoticeService.setNotice(notice.code, notice.color) : null)
    );
  }

  ngOnInit(): void {
    this.verifyForm = this.globalAuthService.initVerifyMailForm();
    this.authNoticeService.setNotice(
      `Du hast Deine E-Mail Adresse noch nicht bestätigt. Bitte überprüfe Dein
      Postfach oder lass Dir die Bestätigungsmail erneut senden`, 'warning');

    const subscription = this.afAuth.user.subscribe((user) => {
      if (user?.emailVerified) {
        this.router.navigate(['/']);
      }
    });
    this.unsubscribe.push(subscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }

  onSubmit() {
    this.isLoading$.next(true);

    this.authService.sendVerificationMail()
      .then(() => {
        this.router.navigate(['/auth/login']);
        this.authNoticeService.setNotice(
          `Eine E-Mail zur Bestätigung Deiner Adresse wurde versendet. Bitte überprüfe Dein Postfach.`,
          'success');
        this.displayProceedLink = true;
        this.verifyForm.disable();
      })
      .catch((err: any) => this.authNoticeService.setNotice(`Es ist ein Fehler aufgetreten (${err.code})`, 'danger'))
      .finally(() => this.isLoading$.next(false));

  }

  async signOutAndRedirect() {
    await this.afAuth.signOut();
    this.router.navigate(['/auth/login']);
  }

}
