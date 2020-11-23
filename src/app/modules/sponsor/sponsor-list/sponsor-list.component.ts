import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SponsorService } from '../sponsor.service';
import { Sponsor } from '../_interfaces/sponsor.interface';

@Component({
  selector: 'sponsor-list',
  templateUrl: './sponsor-list.component.html',
  styleUrls: [
    'sponsor-list.component.scss'
  ]
})
export class SponsorListComponent {

  public items$: Observable<Sponsor[]>;
  public assignedCategoryIds: string[] = [];

  constructor(
    private sponsorService: SponsorService
  ) {
    this.items$ = this.sponsorService.getSponsorList('sponsors');
  }

  /*
  form: FormGroup;

  public itemSize = 120;
  public maxItems = 12;

  public sortOrder: OrderByDirection = 'asc';
  public sortField = 'title';
  public listType = 'sponsors';
  public viewPortHeight = '80vh';

  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport: CdkVirtualScrollViewport;

  @Output() removeSponsor: EventEmitter<string> = new EventEmitter<string>(false);

  theEnd = false;
  offset = new BehaviorSubject(null);
  infinite$: Observable<any[]>;

  scrHeight: number;
  scrWidth: number;

  sub: Subscription;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }

  constructor(private sponsorService: SponsorService) {

    this.getScreenSize();

    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap(n => this.getBatch(n)),
      scan((acc, batch) => {
        return {
          ...acc,
          ...batch
        };
      }, {})
    );

    this.infinite$ = batchMap.pipe(map(v => Object.values(v)));
  }

  getBatch(offset: number) {
    return this.sponsorService.getSponsorList(this.listType, ref =>
      offset
        ? ref.orderBy(this.sortField, this.sortOrder).startAfter(offset).limit(this.maxItems)
        : ref.orderBy(this.sortField, this.sortOrder).limit(this.maxItems))
      .pipe(
        tap(arr => {
          return (arr.length ? null : (this.theEnd = true));
        })
      );
  }

  nextBatch(e: any, offset: number) {
    if (this.theEnd) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    if (end === total) {
      this.offset.next(offset);
    }
  }

  trackByIdx(i: number) {
    return i;
  } */

  setFilters(assignedCategoryIds: string[]) {
    this.assignedCategoryIds = assignedCategoryIds;
  }

}
