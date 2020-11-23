import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ArticleDialogComponent } from './article-dialog/article-dialog.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth.routes';
import { AuthService } from './auth.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GlobalAuthService } from './global-auth.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { FinishedSetupGuard } from './_guards/finished-setup.guard';
import { ForbiddenGuard } from './_guards/forbidden.guard';
import { UnAuthGuard } from './_guards/unauth.guard';
import { VerifyEmailGuard } from './_guards/verify-email.guard';

@NgModule({
  declarations: [
    AuthComponent,
    AuthNoticeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ArticleDialogComponent,
    VerifyEmailComponent
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [
    FinishedSetupGuard,
    AuthService,
    GlobalAuthService,
    ForbiddenGuard,
    UnAuthGuard,
    VerifyEmailGuard
  ]
})

export class AuthModule { }
