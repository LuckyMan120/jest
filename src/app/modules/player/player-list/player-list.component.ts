import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Player } from '../_interfaces/player.interface';

@Component({

  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  dataSource = new MatTableDataSource<Player>();

  displayedColumns = [/* 'select', 'nr',*/
    'id', 'name', 'firstName', 'birthDate', 'assignedMember', 'assignedSenior',
    'ageGroup', 'friendlyMatches', 'officialMatches', 'signOut', 'passPrint', 'actions'
  ];
  pageSizes: number[] = [25, 50, 100, 1000];
  selection = new SelectionModel<Player>(true, []);

  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);
    this.firestoreService.col$<Player>(`players`).pipe(
      map((players: Player[]) => players.map(player => {
        return {
          ...player,
          birthDate: player.birthDate ? new Date(player.birthDate) : '',
          friendlyMatches: player.friendlyMatches ? new Date(player.friendlyMatches) : '',
          officialMatches: player.officialMatches ? new Date(player.officialMatches) : '',
          signOut: player.signOut ? new Date(player.signOut) : '',
          passPrint: player.passPrint ? new Date(player.passPrint) : '',
        };
      })
      )
    ).subscribe((players: any[]) => {
      this.dataSource.data = players;
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

  deletePlayer(item: Player) {
    item.title = this.firestoreService.getUserTitle(item);
    this.firestoreService.removeItem('players', item, 'player');
  }

  /* deletePlayers() {
    if (this.selection.selected.length === 1) {
      const player = this.selection.selected[0] as Player;
      return this.deletePlayer(player);
    }
    this.firestoreService.removeItems('players', this.selection.selected, 'player');
    this.resetListView();
  }

  changePlayers() {
  } */

  resetListView() {
    this.dataSource.filter = '';
    this.selection.clear();
    this.input.nativeElement.value = '';
  }

  redirectToList() {
    this.router.navigate(['/players/list']).then();
  }

}
