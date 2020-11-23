import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SponsorService } from '../sponsor.service';
import { Sponsor } from '../_interfaces/sponsor.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';

@Component({
  selector: 'sponsor-detail',
  templateUrl: './sponsor-detail.component.html',
  styleUrls: ['./sponsor-detail.component.scss']
})
export class SponsorDetailComponent implements OnInit {

  public sponsor!: Sponsor;
  public sponsor$!: Observable<Sponsor>;
  gallery: any;

  constructor(
    private route: ActivatedRoute,
    private sponsorService: SponsorService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.sponsor$ = this.route.params.pipe(
      switchMap(params => this.sponsorService.get(params.sponsorId))
    );
  }

  deleteSponsor(item: Sponsor) {
    this.firestoreService.removeItem('sponsors', item, 'sponsor', '/sponsors/list');
  }

  redirectToList() {
    this.router.navigate(['/sponsors']).then();
  }
}
