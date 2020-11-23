import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Category } from '../../category/_interfaces/category.interface';
import { LocationService } from '../location.service';
import { Location } from '../_interfaces/location.interface';
import { Article } from './../../article/_interfaces/article.interface';
import { Match } from './../../match/_interfaces/match.interface';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss']
})
export class LocationDetailComponent implements OnInit {

  location$!: Observable<Location | undefined>;
  categories$!: Observable<Category[]>;
  assignedMatches$!: Observable<Match[]>;
  assignedArticles$!: Observable<Article[]>;

  constructor(
    private locationService: LocationService,
    private firestoreService: FirestoreService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.location$ = this.route.params.pipe(
      switchMap(params => this.locationService.get(params.locationId)),
      tap((location: Location | undefined) => {
        if (location) {
          this.assignedMatches$ = this.locationService.getAssignedMatches(location.id);
          this.assignedArticles$ = this.locationService.getAssignedArticles(location.id);
        }
      })
    );

    this.categories$ = this.firestoreService.col$('categories');
  }

  onSelectAssignedItemsTab($event: any): void {
    console.log('Now we can load assigned Objects', $event);
  }

  deleteLocation(item: Location) {
    this.firestoreService.removeItem('locations', item, 'location', '/location/list');
  }

  trackByGallery(index: number, gallery: any) {
    return gallery.key;
  }

  public getLocationCategoryTitle(location: Location, idx: number): string {
    if (location && location.assignedCategoryTitles && location.assignedCategoryTitles[idx]) {
      return location.assignedCategoryTitles[idx];
    }
    return '';
  }

}
