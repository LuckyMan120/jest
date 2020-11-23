import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Member } from '../_interfaces/member.interface';
import { NotificationService } from './../../../shared/services/notification.service';

@Component({

  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<Member>();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  exportFile = '';

  exportArgs = {
    collection: 'members',
    fields: ['gender', 'lastName', 'firstName', 'birthDate']
  };

  displayedColumns = [
    /* 'select', 'id', */
    'gender', 'lastName', 'firstName', 'birthDate', 'assignedSenior', 'assignedPlayer',
    'actions'
  ];
  pageSizes: number[] = [25, 50, 100, 1000];
  selection = new SelectionModel<Member>(true, []);

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private fns: AngularFireFunctions,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);
    this.firestoreService.col$<Member>(`members`).pipe(
      map((members: Member[]) => members.map(member => {
        return {
          ...member,
          birthDate: member.birthDate ? new Date(member.birthDate) : ''
        };
      })
      )
    ).subscribe((members: any[]) => {
      this.dataSource.data = members;
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

  deleteMember(item: Member) {
    item.title = this.firestoreService.getUserTitle(item);
    this.firestoreService.removeItem('members', item, 'member');
  }

  redirectToList() {
    return this.router.navigate(['/members/list']);
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

  async export(type: 'CSV' | 'PDF', args?: any): Promise<void> {
    this.isLoading$.next(true);
    const callable = this.fns.httpsCallable(`exportTo${type}`);

    await callable(args ? args : {}).toPromise()
      .then(file => this.exportFile = file)
      .finally(() => this.isLoading$.next(false))
      .catch((error: any) => this.notificationService.showNotification(error, 'danger'));
  }

}
