import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { MatchService } from './../match.service';
import { Match } from './../_interfaces/match.interface';

@Component({

  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<Match>([]);
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  displayedColumns = [/* 'select', 'id',*/ 'playersType', 'title', 'matchStartDate', 'assignedLocationTitle', 'actions'];
  pageSizes: number[] = [25, 50, 100];
  selection = new SelectionModel<Match>(true, []);

  dateFormat!: string;

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private matchService: MatchService
  ) {
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);

    this.firestoreService.col$<Match>(`matches`).pipe(
      takeUntil(this.destroyed$),
      map((matches: Match[]) => this.matchService.generateMatchList(matches))
    ).subscribe((matches: Match[]) => {
      this.dataSource.data = matches;
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

  trackById(index: number, item: Match) {
    return item.id;
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

  deleteMatch(item: Match) {
    this.firestoreService.removeItem('matches', item, 'match');
  }

  redirectToList() {
    this.router.navigate(['/matches/list']).then();
  }

  resetListView() {
    this.dataSource.filter = '';
    this.selection.clear();
    this.input.nativeElement.value = '';
  }

}
