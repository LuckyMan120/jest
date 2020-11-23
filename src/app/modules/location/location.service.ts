import { Injectable } from '@angular/core';
import { CollectionReference, Query } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from './../../views/pages/auth/auth.service';
import { Article } from './../article/_interfaces/article.interface';
import { Category } from './../category/_interfaces/category.interface';
import { Match } from './../match/_interfaces/match.interface';
import { Location } from './_interfaces/location.interface';
import { Marker } from './_interfaces/marker.interface';

@Injectable()
export class LocationService {

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  public async save(location: Location): Promise<any> {
    return this.firestoreService.save(location, 'locations', 'location');
  }

  public getLatestLocation(): Observable<Location | undefined> {
    return this.firestoreService.doc<Location>(`/statistics/latest-location`).valueChanges();
  }

  public getAssignedMatches(locationId: string | undefined): Observable<Match[]> {
    return this.firestoreService.col$<Match>(`matches`, (ref: CollectionReference) => ref.where('assignedLocationId', '==', locationId));
  }

  public getAssignedArticles(locationId: string | undefined): Observable<Article[]> {
    return this.firestoreService.col$<Article>(`articles`, (ref: CollectionReference) => ref.where('assignedLocationId', '==', locationId));
  }

  public getLocationCategories(): Observable<Category[]> {
    return this.firestoreService.col<Category>('categories', (ref: Query) =>
      ref.where('assignedCategoryTitles', 'array-contains', 'Platzarten')
    ).valueChanges();
  }

  public get(id: string): Observable<Location | undefined> {
    return !!!id ? this.initNewLocation() : this.loadLocation(id);
  }

  public getFormFields(): FormGroup {
    return this.fb.group({
      title: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      fupaLink: null,
      text: null,
      assignedCategoryIds: [null, [Validators.required]],
      assignedArticleIds: null,
      assignedMatchIds: null,
      address: this.fb.group({
        streetName: null,
        city: null,
        state: null,
        county: null,
        zip: null,
        houseNumber: null
      }),
      galleries: {
        fotos: {
          title: 'Fotos'
        }
      },
      id: null,
      isImported: null,
      opening: null,
      creation: this.firestoreService.initCreationFormGroup(),
      publication: this.firestoreService.initPublicationFormGroup(),
      modification: this.firestoreService.initModificationFormArray(),
    });
  }

  public getLocationsWithMarkers(): Observable<Location[]> {
    return this.firestoreService.col<Location>('locations', (ref: Query) => ref = ref.where('hasMapMarker', '==', true)).valueChanges();
  }

  public setMapMarker(location: Location, savedMarkers: Marker[]): Marker[] {
    location.marker.forEach((entry: any) => {
      const marker = {
        label: entry.formatted_address,
        lat: entry.geometry.location.lat,
        lng: entry.geometry.location.lng
      };
      if (!savedMarkers.includes(marker)) {
        savedMarkers.push(marker);
      } else {
        savedMarkers.splice(savedMarkers.indexOf(marker), 1);
      }
    });
    return savedMarkers;
  }

  private loadLocation(id: string): Observable<Location | undefined> {
    return this.firestoreService.doc$<Location>(`locations/${id}`).pipe(
      map((location) => {
        if (location) {
          return {
            ...location,
            creation: this.firestoreService.getCreation(location),
            publication: this.firestoreService.getPublication(location),
            modification: this.firestoreService.getModification(location)
          };
        }
      })
    );
  }

  private initNewLocation(): Observable<Location> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          title: '',
          fupaLink: '',
          opening: '',
          address: {
            streetName: '',
            city: '',
            state: '',
            zip: '',
            houseNumber: ''
          },
          galleries: {
            Profilfotos: {
              title: 'Profilfotos'
            }
          },
          assignedCategoryIds: [],
          assignedMatchIds: [],
          text: '',
          isImported: false,
          creation: this.firestoreService.getCreation({}, user),
          publication: this.firestoreService.getPublication({}, user),
          modification: this.firestoreService.getModification({}, { by: user, change: 'NEW' })
        };
      })
    );
  }

}
