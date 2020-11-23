import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { PermissionService } from './../permission.service';
import { Permission } from './../_interfaces/permission.interface';

@Component({

  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<Permission>([]);
  isLoading$!: Observable<boolean>;

  displayedColumns = ['id', 'displayName', 'actions']; // 'title', 'select',
  pageSizes: number[] = [25, 50, 100];
  selection = new SelectionModel<Permission>(true, []);

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.permissionService.getPermissionList().pipe(
      takeUntil(this.destroyed$)
    ).subscribe((permissions: Permission[]) => this.dataSource.data = permissions);

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

  deletePermission(item: Permission) {
    this.firestoreService.removeItem('permissions', item, 'permission');
  }

  /* deletePermissions() {
    if (this.selection.selected.length === 1) {
      const permission = this.selection.selected[0] as Permission;
      return this.deletePermission(permission);
    }
    this.firestoreService.removeItems('permissions', this.selection.selected, 'permission');
    this.resetListView();
  } */

  redirectToList() {
    this.router.navigate(['/permissions/list']).then();
  }

  resetListView() {
    this.dataSource.filter = '';
    this.selection.clear();
    this.input.nativeElement.value = '';
  }

}
