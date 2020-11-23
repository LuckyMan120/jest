import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../../../shared/services/firestore.service';
import { ClubHonorary } from '../../_interfaces/club-honorary.interface';

@Component({
  selector: 'app-club-honorary-list',
  templateUrl: './club-honorary-list.component.html',
  styleUrls: ['./club-honorary-list.component.scss']
})
export class ClubHonoraryListComponent implements OnInit {

  honoraries$!: Observable<ClubHonorary[]>;

  constructor(
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
    this.honoraries$ = this.firestoreService.col<ClubHonorary>('club-honorary').valueChanges();
  }

  deleteHonorary(item: ClubHonorary) {
    this.firestoreService.removeItem('club-honorary', item, 'club-honorary');
  }

}
