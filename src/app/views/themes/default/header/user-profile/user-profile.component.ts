import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../../../modules/user/_interfaces/user.interface';
import { AuthService } from '../../../../pages/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {

  user$!: Observable<User>;

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.user$ = this.authService.authUser$;
  }

  logout() {
    this.authService.logout();
  }
}
