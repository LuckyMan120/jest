import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginatorTranslationIntl extends MatPaginatorIntl implements OnDestroy {

  private rangeLabelIntl!: string;
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(
  ) {
    super();
    // this.service.onLangChange.subscribe((e: Event) => this.getAndInitTranslations());
    // this.getAndInitTranslations();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /* getAndInitTranslations() {
    this.service.get([
      'PAGINATOR.FIRST_PAGE',
      'PAGINATOR.LAST_PAGE',
      'PAGINATOR.ITEMS_PER_PAGE',
      'PAGINATOR.NEXT_PAGE',
      'PAGINATOR.PREVIOUS_PAGE',
      'PAGINATOR.RANGE'
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(translation => {
        this.itemsPerPageLabel = translation['PAGINATOR.ITEMS_PER_PAGE'];
        this.nextPageLabel = translation['PAGINATOR.NEXT_PAGE'];
        this.previousPageLabel = translation['PAGINATOR.PREVIOUS_PAGE'];
        this.getRangeLabel = this.getRangeLabel.bind(this);
        this.rangeLabelIntl = translation['PAGINATOR.RANGE'];
        this.changes.next();
      });
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return this.service.instant('PAGINATOR.RANGE_LABEL_NO_ITEMS', { length });
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.service.instant('PAGINATOR.RANGE_LABEL', {
      startIndex: startIndex + 1,
      endIndex,
      length
    });
  } */

}
