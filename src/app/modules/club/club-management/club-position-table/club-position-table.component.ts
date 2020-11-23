import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '../../../../shared/services/firestore.service';
import { ClubManagement } from '../../_interfaces/club-management.interface';

@Component({
  selector: 'app-club-position-table',
  templateUrl: './club-position-table.component.html',
  styleUrls: ['./club-position-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubPositionTableComponent implements OnInit {

  @Input() positions!: ClubManagement[];

  constructor(
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
  }

  deletePosition(position: ClubManagement): void {
    return this.firestoreService.removeItem('club-management', position, 'club-management', '/club/management');
  }

}
