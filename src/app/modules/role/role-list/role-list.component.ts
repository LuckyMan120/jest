import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { RoleService } from '../role.service';
import { Role } from './../_interfaces/role.interface';

@Component({

  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<Role>([]);
  isLoading$!: Observable<boolean>;

  displayedColumns = ['id', 'title', 'assignedPermissions', 'assignedUserIds', 'actions']; // 'select'
  pageSizes: number[] = [5, 25, 50, 100];
  selection = new SelectionModel<Role>(true, []);

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private roleService: RoleService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.roleService.getRoleList().pipe(
      takeUntil(this.destroyed$)
    ).subscribe((roles: Role[]) => this.dataSource.data = roles);

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

  deleteRole(item: Role) {
    this.firestoreService.removeItem('roles', item, 'role');
  }

  /* deleteRoles() {
    if (this.selection.selected.length === 1) {
      const role = this.selection.selected[0] as Role;
      return this.deleteRole(role);
    }
    this.firestoreService.removeItems('roles', this.selection.selected, 'role');
    this.resetListView();
  } */

  redirectToList() {
    this.router.navigate(['/roles/list']).then();
  }

  resetListView() {
    this.dataSource.filter = '';
    this.selection.clear();
    this.input.nativeElement.value = '';
  }

}
