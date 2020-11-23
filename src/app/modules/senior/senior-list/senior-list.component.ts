import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Senior } from './../_interfaces/senior.interface';

@Component({

  selector: 'app-senior-list',
  templateUrl: './senior-list.component.html',
  styleUrls: ['./senior-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeniorListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<Senior>();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  displayedColumns = [/* 'select', 'id',*/
    'gender', 'lastName', 'firstName', 'birthDate', 'assignedMember', 'assignedPlayer',
    'entryDate', 'exitDate', 'actions'
  ];
  pageSizes: number[] = [25, 50, 100, 1000];
  selection = new SelectionModel<Senior>(true, []);

  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);
    this.firestoreService.col$<Senior>(`seniors`).pipe(
      map((seniors: Senior[]) => seniors.map(senior => {
        return {
          ...senior,
          birthDate: senior.birthDate ? new Date(senior.birthDate) : '',
          friendlyMatches: senior.entryDate ? new Date(senior.entryDate) : '',
          officialMatches: senior.exitDate ? new Date(senior.exitDate) : '',
        };
      })
      )
    ).subscribe((seniors: any[]) => {
      this.dataSource.data = seniors;
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

  deleteSenior(item: Senior) {
    item.title = this.firestoreService.getUserTitle(item);
    this.firestoreService.removeItem('seniors', item, 'senior');
  }

  redirectToList() {
    return this.router.navigate(['/seniors/list']);
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
