import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../../modules/user/_interfaces/user.interface';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'creation-form',
  templateUrl: './creation-form.component.html',
  styleUrls: ['./creation-form.component.scss']
})
export class CreationFormComponent implements OnInit {

  @Input() form!: FormGroup;

  users$!: Observable<User[]>;

  constructor(
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
    this.users$ = this.firestoreService.col$<User>(`users`);
  }

}
