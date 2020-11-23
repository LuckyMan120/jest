import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Article } from '../_interfaces/article.interface';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<Article>([]);
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  displayedColumns = [/*'select',*/ 'title', 'articleDate', 'publication.at', 'publication.by', 'actions'];
  pageSizes: number[] = [25, 50, 100];
  selection = new SelectionModel<Article>(true, []);
  now!: number;

  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
    this.now = new Date().valueOf();
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);
    this.firestoreService.col$<Article>(`articles`).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((articles: Article[]) => {
      this.dataSource.data = articles;
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

  deleteArticle(item: Article) {
    this.firestoreService.removeItem('articles', item, 'article');
  }

  redirectToList() {
    this.router.navigate(['/articles/list']).then();
  }

  resetListView() {
    this.dataSource.filter = '';
    this.selection.clear();
    this.input.nativeElement.value = '';
  }

  trackById(index: number, item: any) {
    return item;
  }

}
