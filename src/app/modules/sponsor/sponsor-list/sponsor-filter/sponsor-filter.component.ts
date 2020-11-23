import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Category } from './../../../category/_interfaces/category.interface';
import { SponsorService } from './../../sponsor.service';

@Component({
  selector: 'sponsor-filter',
  templateUrl: './sponsor-filter.component.html',
  styleUrls: ['./sponsor-filter.component.scss']
})
export class SponsorFilterComponent implements OnInit, OnDestroy {

  @Output() setFilters: EventEmitter<string[]> = new EventEmitter<string[]>(true);

  categories$!: Observable<Category[]>;
  assignedCategoryIdsControl = new FormControl();
  sub!: Subscription;

  constructor(
    private sponsorService: SponsorService
  ) {
  }

  ngOnInit(): void {
    this.categories$ = this.sponsorService.getSponsoringCategories().pipe(
      tap(categories => this.assignedCategoryIdsControl.patchValue(categories.map(category => category.id)))
    );

    this.sub = this.assignedCategoryIdsControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((changes: string[]) => this.setFilters.emit(changes));
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
