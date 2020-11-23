import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Category } from './../_interfaces/category.interface';

@Component({
  selector: 'app-category-list-server',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  public dataSource = new MatTableDataSource<Category>([]);
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public displayedColumns = [
    'nr',
    'id',
    'title',
    'assignedCategoryTitles',
    'actions'
  ];
  public pageSizes: number[] = [25, 50, 100];
  public selection = new SelectionModel<Category>(true, []);

  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);
    this.firestoreService.col$<Category>(`categories`).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((categories: Category[]) => {
      this.dataSource.data = categories;
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

  deleteCategory(item: Category) {
    this.firestoreService.removeItem('categories', item, 'category');
  }

  /* deleteCategories() {
    if (this.selection.selected.length === 1) {
      const category = this.selection.selected[0] as Category;
      return this.deleteCategory(category);
    }
    this.firestoreService.removeItems('categories', this.selection.selected, 'category');
    this.resetListView();
  }

  changeCategories() {
    const formFields = [
      { fieldName: 'title', fieldType: 'text' },
      { fieldName: 'assignedCategoryIds', fieldType: 'select', options: this.firestoreService.col$('categories') }
    ];
    this.firestoreService.editItems('categories', this.selection.selected, formFields);
    this.resetListView();
  } */

  redirectToList() {
    this.router.navigate(['/categories/list']).then();
  }

  resetListView() {
    this.dataSource.filter = '';
    this.selection.clear();
    this.input.nativeElement.value = '';
  }
}
