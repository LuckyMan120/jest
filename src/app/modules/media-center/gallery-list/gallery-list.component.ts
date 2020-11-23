import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { MediaService } from './../../../shared/modules/media/media.service';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { LayoutUtilsService, MessageType } from './../../../shared/services/layout-utils.service';
import { MediaGallery } from './../../../shared/_interfaces/media-gallery.interface';

@Component({

  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.scss']
})
export class GalleryListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<MediaGallery>();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  displayedColumns = [/*'select', 'id',*/ 'title', 'actions'];
  pageSizes: number[] = [25, 50, 100, 1000];
  selection = new SelectionModel<MediaGallery>(true, []);

  constructor(
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private mediaService: MediaService,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);
    this.mediaService.getGalleries().subscribe((galleries: MediaGallery[]) => {
      this.dataSource.data = galleries;
      this.isLoading$.next(false);
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        map(() => this.applyFilter(this.input.nativeElement.value)),
        takeUntil(this.destroyed$)
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  deleteGallery(item: MediaGallery, redirect: boolean) {
    const title = `Galerie löschen`;
    const description = `Soll die Galerie ${item.title} wirklich gelöscht werden?`;
    const waitDescription = `Die Galerie ${item.title} wird gerade gelöscht ...`;
    const deleteMessage = 'Die Galerie wurde gelöscht.';

    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDescription);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.firestoreService.delete(this.firestoreService.doc(`media-galleries/` + item.id)).then(
        () => this.layoutUtilsService.showActionNotification(deleteMessage, 'danger', MessageType.Delete));

      if (redirect) {
        this.redirectToList();
      }
    });
  }

  redirectToList() {
    return this.router.navigate(['/members/list']);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.selection.selected.length === this.dataSource.data.length) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

}
