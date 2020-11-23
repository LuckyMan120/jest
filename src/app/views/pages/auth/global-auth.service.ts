import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from './register/confirm-password.validator';

@Injectable()
export class GlobalAuthService {

  length3 = 3;
  length6 = 6;
  length100 = 100;
  length320 = 320;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  initVerifyMailForm() {
    return this.fb.group({});
  }

  initLoginForm() {
    return this.fb.group({
      email: [
        'Thomas.handle@gmail.com', Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320)
        ])
      ],
      password: [
        'test123', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])
      ],
      rememberMe: [true]
    });
  }

  initForgotPasswordForm() {
    return this.fb.group({
      email: [
        '', Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(this.length6),
          Validators.maxLength(this.length320)
        ])
      ]
    });
  }

  initRegistrationForm() {
    return this.fb.group({
      lastName: [
        'Thomas', Validators.compose([
          Validators.required,
          Validators.minLength(this.length3),
          Validators.maxLength(this.length100)
        ])
      ],
      firstName: [
        'Handle', Validators.compose([
          Validators.required,
          Validators.minLength(this.length3),
          Validators.maxLength(this.length100)
        ])
      ],
      email: [
        'Thomas.handle@gmail.com', Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(this.length3),
          Validators.maxLength(this.length320)
        ])
      ],
      displayName: [
        'Meistercoach', Validators.compose([
          Validators.required,
          Validators.minLength(this.length3),
          Validators.maxLength(this.length100)
        ])
      ],
      password: [
        'test123', Validators.compose([
          Validators.required,
          Validators.minLength(this.length3),
          Validators.maxLength(this.length100)
        ])
      ],
      confirmPassword: [
        'test123', Validators.compose([
          Validators.required,
          Validators.minLength(this.length3),
          Validators.maxLength(this.length100)
        ])
      ],
      agree: [true]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

}
