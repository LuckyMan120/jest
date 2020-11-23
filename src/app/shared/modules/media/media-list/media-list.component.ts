import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MediaItem } from '@shared/_interfaces/media-item.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MediaService } from '../media.service';
import { Category } from './../../../../modules/category/_interfaces/category.interface';
import { FirestoreService } from './../../../services/firestore.service';
import { LayoutUtilsService } from './../../../services/layout-utils.service';

@Component({

  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnDestroy, OnInit {

  @Input() public set infiniteScrollContainer(value) {
    this._infiniteScrollContainer = value;
    this.fromRoot = true;
    this.scrollWindow = false;
  }

  public get infiniteScrollContainer() {
    return this._infiniteScrollContainer;
  }

  constructor(
    private mediaService: MediaService,
    private layoutUtilsService: LayoutUtilsService,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    // private categoryService: CategoryService
  ) {
    this.loading();
    this.mediaService.getMedias().pipe(take(1), tap(this.loaded)).subscribe(this.addItems);
    this.mediaService.getNewMedias().pipe(takeUntil(this.destroy$)).subscribe((r) => this.addItems(r, true));
    this.mediaService.getDeletedMedias().pipe(takeUntil(this.destroy$)).subscribe((r) => this.removeItems(r));
  }

  @Output() setSelect: EventEmitter<MediaItem> = new EventEmitter<MediaItem>();
  @Output() deSelect: EventEmitter<MediaItem> = new EventEmitter<MediaItem>();

  @Input() mode: 'select' | 'edit' = 'edit';
  @Input() allowUpload = false;

  public fromRoot = false;
  public scrollWindow = true;

  private _infiniteScrollContainer!: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private _loading = true;

  public medias: any;
  public showUploader = true;
  public medias$ = new BehaviorSubject<MediaItem[]>([]);
  private savedSelection = ['all'];
  private selectedMediaItem!: MediaItem | undefined;

  public categories$!: Observable<Category[]>;
  public assignedCategoryIdsControl = new FormControl();

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.dialog && params.mediaId) {
        this.firestoreService.doc<MediaItem>(`medias/${params.mediaId}`).valueChanges()
          .pipe(
            takeUntil(this.destroy$),
            tap((mediaItem: MediaItem | undefined) => this.selectedMediaItem = mediaItem),
            switchMap(() => this.getFileCategories()),
            map((categories: Category[]) => {
              return { media: this.selectedMediaItem, categories };
            })
          ).subscribe((data: any) => this.layoutUtilsService.showMediaInfo(data));
      }

      this.categories$ = this.getFileCategories().pipe(
        tap((categories: Category[]) => categories.sort((a: Category, b: Category) =>
          a.title < b.title ? -1 : (a.title > b.title) ? 1 : 0)
        ),
        tap(() => this.assignedCategoryIdsControl.patchValue(['all']))
      );

    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getFileCategories(): Observable<Category[]> {
    return this.firestoreService.col$<Category>(`categories`, (ref: Query) => {
      ref = ref.where('assignedCategoryTitles', 'array-contains', 'Dateikategorien');
      return ref.orderBy('title');
    });;
  }

  onScroll() {
    if (this._loading) {
      return;
    }
    this.loading();
    this.mediaService.getNextMedias().pipe(take(1), tap(this.loaded)).subscribe(this.addItems);
  }

  selectionChange($event: MatSelectChange) {
    if (this.savedSelection.indexOf('all') === -1 && $event.value.indexOf('all') > -1) {
      this.savedSelection = ['all'];
      $event.value = [];
      this.assignedCategoryIdsControl.patchValue(['all']);
    } else {
      if ($event.value.indexOf('all') > -1) {
        $event.value.splice($event.value.indexOf('all'), 1);
        this.assignedCategoryIdsControl.patchValue($event.value);
      }
      this.savedSelection = $event.value;
    }
    this.mediaService.getMedias($event.value).pipe(take(1), tap(this.loaded)).subscribe(medias => this.medias$.next(medias));
  }

  public trackById = (index: number, item: any) => item.id;

  private loading = () => this._loading = true;
  private loaded = () => this._loading = false;

  private removeItems = (items: MediaItem[]) => {
    const currentList = this.medias$.value;
    for (const item of items) {
      const m = currentList.find(r => r.id === item.id);
      if (m) {
        const index = currentList.indexOf(m);
        if (index > -1) {
          currentList.splice(index, 1);
        }
      }
    }
  }

  private addItems = (items: MediaItem[], prepend = false) => {

    if (items && items.length === 0) {
      return;
    }
    const currentList = this.medias$.value;
    let result: any;
    if (prepend) {
      result = currentList;

      for (const item of items) {
        const m = result.find((r: any) => r.id === item.id);
        const index = result.indexOf(m);

        if (index >= 0) {
          result[index] = item;
        } else {
          result = [item].concat(result);
        }
      }

    } else {
      result = currentList.concat(items);
    }
    this.medias$.next(result);
  }

}
