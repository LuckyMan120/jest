import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Role } from '../../role/_interfaces/role.interface';
import { UserService } from '../user.service';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { User } from './../_interfaces/user.interface';

@Component({

  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  user$!: Observable<User | undefined>;
  roles$!: Observable<Role[]>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.user$ = this.route.params.pipe(switchMap(params => this.userService.get(params.userId)));
    this.roles$ = this.firestoreService.col$('roles');
  }

  deleteUser(item: User) {
    this.firestoreService.removeItem('users', item, 'user', '/users/list');
  }

}
