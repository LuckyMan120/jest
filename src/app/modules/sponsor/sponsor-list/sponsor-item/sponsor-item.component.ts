import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Sponsor } from '../../_interfaces/sponsor.interface';
import { FirestoreService } from './../../../../shared/services/firestore.service';

@Component({
  selector: 'sponsor-item',
  templateUrl: './sponsor-item.component.html',
  styleUrls: ['./sponsor-item.component.scss']
})
export class SponsorItemComponent implements OnInit {

  @Input() sponsor!: Sponsor;

  contactImage$!: Observable<string>;
  maxDescriptionLength = 100;

  constructor(
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
  }

  deleteSponsor(item: Sponsor) {
    this.firestoreService.removeItem('sponsors', item, 'sponsor');
  }


}
