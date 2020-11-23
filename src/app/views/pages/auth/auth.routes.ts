import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { FinishedSetupGuard } from './_guards/finished-setup.guard';
import { ForbiddenGuard } from './_guards/forbidden.guard';
import { UnAuthGuard } from './_guards/unauth.guard';
import { VerifyEmailGuard } from './_guards/verify-email.guard';


export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [FinishedSetupGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UnAuthGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [UnAuthGuard]
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [UnAuthGuard]
      },
      {
        path: 'verify-email',
        component: VerifyEmailComponent,
        canActivate: [VerifyEmailGuard]
      },
      {
        path: 'forbidden',
        component: ForbiddenComponent,
        canActivate: [ForbiddenGuard]
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}

