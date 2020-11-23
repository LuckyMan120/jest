import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../../modules/user/_interfaces/user.interface';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'publication-form',
  templateUrl: './publication-form.component.html',
  styleUrls: ['./publication-form.component.scss']
})
export class PublicationFormComponent implements OnInit {

  @Input() form!: FormGroup;

  users$!: Observable<User[]>;

  currentTimestamp!: number;

  constructor(
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
    this.currentTimestamp = new Date().valueOf();
    this.users$ = this.firestoreService.col$<User>(`users`);
  }

}
