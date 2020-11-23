import { Injectable } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionPredicate, FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from '../../views/pages/auth/auth.service';
import { Category } from './../category/_interfaces/category.interface';
import { Sponsor } from './_interfaces/sponsor.interface';

@Injectable()
export class SponsorService {

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  public async save(sponsor: Sponsor): Promise<string> {
    if (sponsor.startDate) {
      sponsor.startDate = sponsor.startDate.valueOf();
    }
    if (sponsor.endDate) {
      sponsor.endDate = sponsor.endDate.valueOf();
    }
    return this.firestoreService.save(sponsor, 'sponsors', 'sponsor', true);
  }

  public getSponsorList(ref: CollectionPredicate<Sponsor>, queryFn?: any): Observable<Sponsor[]> {
    return this.firestoreService.col<Sponsor>(ref, queryFn).snapshotChanges().pipe(
      map(docs => docs.map(a => a.payload.doc.data()) as Sponsor[])
    );
  }

  public getSponsoringCategories(): Observable<Category[]> {
    return this.firestoreService.col$(`categories`, (ref: CollectionReference) =>
      ref.where('assignedCategoryTitles', 'array-contains', 'Sponsoring-Arten')
    );
  }

  public get(id: string): Observable<Sponsor> {
    return !!!id ? this.initNewSponsor() : this.loadSponsor(id);
  }

  public getFormFields(): FormGroup {
    return this.fb.group({
      title: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      externalLink: null,
      description: null,
      assignedCategoryIds: [null, [Validators.required]],
      assignedArticleIds: [null],
      startDate: null,
      endDate: null,
      internalInfo: null,
      displayInFooter: null,
      displayOnHomepage: null,
      displayAsTopSponsor: null,
      contact: this.fb.group({
        email: null,
        phoneWork: null,
        fax: null,
        name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
      }),
      id: [null],
      revenue: null,
      galleries: null,
      files: null,
      address: this.fb.group({
        streetName: null,
        houseNumber: null,
        city: null,
        zip: null,
        county: null,
        state: null
      }),
      creation: this.firestoreService.initCreationFormGroup(),
      publication: this.firestoreService.initPublicationFormGroup(),
      modification: this.firestoreService.initModificationFormArray()
    });
  }

  private loadSponsor(id: string): Observable<Sponsor> {
    return this.firestoreService.doc$<Sponsor>(`sponsors/${id}`).pipe(
      map(sponsor => {
        return {
          ...sponsor,
          endDate: sponsor.endDate ? new Date(sponsor.endDate) as any : null,
          startDate: sponsor.startDate ? new Date(sponsor.startDate) as any : null,
          creation: this.firestoreService.getCreation(sponsor),
          publication: this.firestoreService.getPublication(sponsor),
          modification: this.firestoreService.getModification(sponsor)
        };
      })
    );
  }

  private initNewSponsor(): Observable<Sponsor> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          title: '',
          displayInFooter: true,
          displayOnHomepage: true,
          displayAsTopSponsor: false,
          description: '',
          assignedArticleIds: [],
          assignedCategoryIds: [],
          internalInfo: '',
          contact: {
            name: '',
            email: '',
            phoneWork: '',
            fax: ''
          },
          address: {
            houseNumber: '',
            streetName: '',
            city: '',
            county: '',
            zip: '',
            state: ''
          },
          externalLink: '',
          startDate: new Date() as any,
          revenue: 0,
          galleries: {
            Firmenlogos: { title: 'Firmenlogos' },
            Ansprechpartner: { title: 'Ansprechpartner' },
            Werbeanzeigen: { title: 'Werbeanzeigen' },
            Werbevideos: { title: 'Werbevideos' }
          },
          files: {
            Dokumente: { title: 'Dokumente' }
          },
          creation: this.firestoreService.getCreation({}, user),
          publication: this.firestoreService.getPublication({}, user),
          modification: this.firestoreService.getModification({}, { by: user, change: 'NEW' })
        };
      })
    );
  }
}
