import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Category } from '../../category/_interfaces/category.interface';
import { LocationService } from '../location.service';
import { Location } from '../_interfaces/location.interface';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {

  location$!: Observable<Location | undefined>;

  form!: FormGroup;
  categories$!: Observable<Category[]>;
  titleMaxLength = 150;
  savedLocation!: Location;
  hasFormErrors = false;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    private locationService: LocationService
  ) {
  }

  ngOnInit() {
    this.form = this.locationService.getFormFields();

    this.location$ = this.route.params.pipe(
      switchMap(params => this.locationService.get(params.locationId)),
      map((location: Location | undefined) => {
        if (location) {
          this.form.patchValue(location);

          if (this.form.get('creation.by')?.value === 'system') {
            this.form.get('creation')?.disable();
          }

          this.savedLocation = Object.freeze(Object.assign({}, location));
          return location;
        }
      })
    );

    this.categories$ = this.locationService.getLocationCategories();
  }

  public get openingControl() {
    return this.form.controls.opening;
  }

  public get textControl() {
    return this.form.controls.text;
  }

  redirectToList() {
    this.router.navigate(['/locations/list']).then();
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.locationService.save(this.form.value as Location).then(() => {
      if (withBack) {
        this.redirectToList();
      }
    });
  }

  deleteLocation(item: Location) {
    this.firestoreService.removeItem('locations', item, 'location', '/locations/list');
  }

  reset(): void {
    this.form.patchValue(this.savedLocation);
  }

  onAlertClose(): void {
    this.hasFormErrors = false;
  }

  updateControl($event: any) {
    const control = this.form.controls.galleries;
    control.setValue($event);
    control.markAsDirty();
  }

}
