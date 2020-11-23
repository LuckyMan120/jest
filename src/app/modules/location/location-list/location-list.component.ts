import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Location } from '../_interfaces/location.interface';
import { LocationService } from './../location.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<Location>([]);
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  displayedColumns = [/*'select', 'id', */'title', 'assignedCategoryTitle', 'actions'];
  pageSizes: number[] = [25, 50, 100];
  selection = new SelectionModel<Location>(true, []);

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private locationService: LocationService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);
    this.firestoreService.col$<Location>(`locations`).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((locations: Location[]) => {
      this.dataSource.data = locations;
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

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  trackById(index: number, item: any) {
    return item;
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.selection.selected.length === this.dataSource.data.length) {
      this.selection.clear();
    } else {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.dataSource.data.slice(startIndex, endIndex).forEach((row) => this.selection.select(row));
    }
  }

  deleteLocation(item: Location) {
    this.firestoreService.removeItem('locations', item, 'location');
  }

  /* deleteLocations() {
    if (this.selection.selected.length === 1) {
      const location = this.selection.selected[0] as Location;
      return this.deleteLocation(location);
    }
    this.firestoreService.removeItems('locations', this.selection.selected, 'location');
    this.resetListView();
  }

  changeLocations() {
    const options = this.locationService.getLocationCategories();
    const formFields = [
      { fieldName: 'title', fieldType: 'text' },
      { fieldName: 'assignedCategoryIds', fieldType: 'multi-select', options }
    ];
    this.firestoreService.editItems('locations', this.selection.selected, formFields);
    this.resetListView();
  } */

  redirectToList() {
    this.router.navigate(['/locations/list']).then();
  }

  resetListView() {
    this.dataSource.filter = '';
    this.selection.clear();
    this.input.nativeElement.value = '';
  }

}
