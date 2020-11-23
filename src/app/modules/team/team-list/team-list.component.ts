import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Team } from '../_interfaces/team.interface';

@Component({

  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})

export class TeamListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource: MatTableDataSource<Team> = new MatTableDataSource<Team>([]);
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  displayedColumns = [/*'select', 'id', */'title', 'subTitle', 'assignedSeasonId', 'actions'];
  pageSizes: number[] = [25, 50, 100];
  selection = new SelectionModel<Team>(true, []);

  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);
    this.firestoreService.col$<Team>(`teams`).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((teams: Team[]) => {
      this.dataSource.data = teams;
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

  deleteTeam(item: Team) {
    this.firestoreService.removeItem('teams', item, 'team');
  }

  /* deleteTeams() {
    if (this.selection.selected.length === 1) {
      const team = this.selection.selected[0] as Team;
      return this.deleteTeam(team);
    }
    this.firestoreService.removeItems('teams', this.selection.selected, 'team');
    this.resetListView();
  }

  changeTeams() {
    const formFields = [
      { fieldName: 'title', fieldType: 'text' },
      // { fieldName: 'assignedCategoryId', fieldType: 'select', options: this.firestoreService.col$('categories') }
    ];
    this.firestoreService.editItems('teams', this.selection.selected, formFields);
    this.resetListView();
  } */

  redirectToList() {
    this.router.navigate(['/teams/list']).then();
  }

  resetListView() {
    this.dataSource.filter = '';
    this.selection.clear();
    this.input.nativeElement.value = '';
  }

}
