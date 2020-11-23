import { Injectable } from '@angular/core';
import { DocumentChangeAction, Query, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore.service';
import { MediaItem } from '../../_interfaces/media-item.interface';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  lastVisible!: QueryDocumentSnapshot<MediaItem> | undefined;

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder
  ) { }

  getGalleries() {
    return this.firestoreService.col<any>(`media-galleries`).valueChanges();
  }

  getNewMedias(assignedCategoryIds = []): Observable<MediaItem[]> {
    return this.firestoreService.col<MediaItem>(`medias`, this.newMediaQuery(assignedCategoryIds)).valueChanges()
      .pipe(this.mapToMediaItem());
  }

  getDeletedMedias(assignedCategoryIds = []): Observable<MediaItem[]> {
    return this.firestoreService.col<MediaItem>(`medias`, this.mediaQuery(assignedCategoryIds)).stateChanges(['removed'])
      .pipe(
        this.mapDocumentChangeToMediaItem(),
        this.mapToMediaItem());
  }

  getNextMedias(assignedCategoryIds = []): Observable<MediaItem[]> {
    return this.firestoreService.col<MediaItem>(`medias`, this.mediaQuery(assignedCategoryIds)).snapshotChanges()
      .pipe(
        this.mapDocumentChangeToMediaItem(),
        this.mapToMediaItem()
      );
  }

  getMedias(assignedCategoryIds = []): Observable<MediaItem[]> {
    this.lastVisible = undefined;
    return this.firestoreService.col<MediaItem>(`medias`, this.mediaQuery(assignedCategoryIds)).snapshotChanges()
      .pipe(
        this.mapDocumentChangeToMediaItem(),
        this.mapToMediaItem()
      );
  }

  getMediaStats(): Observable<any> {
    return this.firestoreService.doc(`statistics/medias-statistics`).valueChanges();
  }

  getFormFields(minLength: number, maxLength: number) {
    return this.fb.group({
      id: null,
      fileTitle: [null, [
        Validators.required,
        Validators.minLength(minLength),
        Validators.maxLength(maxLength)]
      ]
    });
  }
  private newMediaQuery = (assignedCategoryIds: string[]) => (ref: Query) => {
    if (assignedCategoryIds.length === 1) {
      ref = ref.where('assignedCategoryIds', 'array-contains-any', assignedCategoryIds);
    } else {
      if (assignedCategoryIds.length > 1) {
        ref = ref.where('assignedCategoryIdss', 'in', [assignedCategoryIds]);
      }
    }
    ref = ref.where('creation.at', '>', (new Date().getTime()));
    return ref.orderBy('creation.at', 'desc');
  }

  private mediaQuery = (assignedCategoryIds: string[]) => (ref: Query) => {
    if (assignedCategoryIds.length === 1) {
      ref = ref.where('assignedCategoryIds', 'array-contains-any', assignedCategoryIds);
    } else {
      if (assignedCategoryIds.length > 1) {
        console.log(assignedCategoryIds);
        ref = ref.where('assignedCategoryIds', 'array-contains-any', assignedCategoryIds);
      }
    }
    ref = ref.limit(20);
    ref = ref.orderBy('creation.at', 'desc');

    if (this.lastVisible) {
      ref = ref.startAfter(this.lastVisible);
    }
    return ref;
  }

  private mapDocumentChangeToMediaItem = () => map((r: DocumentChangeAction<MediaItem>[]) => {
    const lastVisible = r[r.length - 1];
    if (lastVisible) { this.lastVisible = lastVisible.payload.doc; }
    return r.map(p => p.payload.doc.data() as MediaItem);
  })

  private mapToMediaItem = () => map((items: MediaItem[]) => {
    return items.map((item: MediaItem) => {
      return {
        ...item,
        creation: {
          by: item.creation.by,
          at: new Date(item.creation.at) as any
        }
      };
    });
  })

}
