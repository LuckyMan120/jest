import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { MatchService } from '../match.service';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { Match } from './../_interfaces/match.interface';

@Component({

  selector: 'missing-match-results',
  templateUrl: './missing-match-results.component.html',
  styleUrls: ['./missing-match-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissingMatchResultsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) input!: ElementRef;

  private destroyed$ = new Subject<void>();

  dataSource = new MatTableDataSource<Match>([]);
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  form: any;
  displayedColumns = [/*'select', 'id',*/ 'matchStartDate', 'title', 'result', 'otherEvent', 'actions'];
  pageSizes: number[] = [25, 50, 100];
  selection = new SelectionModel<Match>(true, []);

  matches!: Match[];
  dateFormat!: string;

  otherMatchEvents!: { id: number; title: string }[];
  shortDateTimeFormat!: string;

  constructor(
    private fb: FormBuilder,
    private matchService: MatchService,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      matches: this.fb.array([])
    });
    this.otherMatchEvents = this.matchService.getOtherEventListForMatch();
  }

  ngAfterViewInit() {
    this.isLoading$.next(true);

    this.matchService.getMatchesWithoutResult().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((matches: Match[]) => {
      this.form.setControl('matches', this.matchService.getMatchResultFields(matches));
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

  saveMatch(fg: FormGroup): Promise<string> {
    return this.matchService.save(fg.value);
  }

  deleteMatch(item: Match) {
    this.firestoreService.removeItem('matches', item, 'match');
  }

  updateValidators($event: MatSelectChange, fg: FormGroup) {
    if ($event.value) {
      fg.get('result.homeTeamGoals')?.clearValidators();
      fg.get('result.guestTeamGoals')?.clearValidators();
    } else {
      fg.get('result.homeTeamGoals')?.setValidators([Validators.required, Validators.pattern('^\\d*$')]);
      fg.get('result.guestTeamGoals')?.setValidators([Validators.required, Validators.pattern('^\\d*$')]);
    }
    fg.get('result.homeTeamGoals')?.updateValueAndValidity();
    fg.get('result.guestTeamGoals')?.updateValueAndValidity();
  }

  updateInputs($event: MatCheckboxChange, fg: FormGroup) {
    if ($event.checked) {
      fg.get('result.homeTeamGoals')?.disable();
      fg.get('result.guestTeamGoals')?.disable();
      fg.get('result.otherEvent')?.enable();
    } else {
      fg.get('result.homeTeamGoals')?.enable();
      fg.get('result.guestTeamGoals')?.enable();
      fg.get('result.otherEvent')?.disable();
    }
    fg.get('result.homeTeamGoals')?.updateValueAndValidity();
    fg.get('result.guestTeamGoals')?.updateValueAndValidity();
    fg.get('result.otherEvent')?.updateValueAndValidity();
  }

}
