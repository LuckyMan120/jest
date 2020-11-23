import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Role } from '../../role/_interfaces/role.interface';
import { UserService } from './../user.service';
import { User } from './../_interfaces/user.interface';

@Component({

  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<User>([]);
  isLoading$!: Observable<boolean>;

  roles$!: Observable<Role[]>;

  displayedColumns = ['displayName', 'firstName', 'lastName', 'assignedRoles', 'actions']; // 'select', 'email',
  pageSizes: number[] = [5, 25, 50, 100];
  selection = new SelectionModel<User>(true, []);

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.roles$ = this.firestoreService.col<Role>(`roles`).valueChanges();
  }

  ngAfterViewInit() {
    this.userService.getUserList().pipe(takeUntil(this.destroyed$)).subscribe((users: User[]) => this.dataSource.data = users);

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

  deleteUser(user: User) {
    user.title = this.firestoreService.getUserTitle(user);
    this.firestoreService.removeItem('users', user, 'user');
  }

  /* deleteUsers() {
    if (this.selection.selected.length === 1) {
      const user = this.selection.selected[0] as User;
      return this.deleteUser(user);
    }
    this.firestoreService.removeItems('users', this.selection.selected, 'user');
    this.resetListView();
  } */

  redirectToList() {
    this.router.navigate(['/users/list']).then();
  }

  resetListView() {
    this.dataSource.filter = '';
    this.selection.clear();
    this.input.nativeElement.value = '';
  }
}
