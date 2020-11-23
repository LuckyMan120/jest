import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  isDevMode,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID
} from '@angular/core';
import { animationFrameScheduler, BehaviorSubject, combineLatest, Observable, pipe, Subject } from 'rxjs';
import { auditTime, filter, map, share, startWith, takeUntil, throttleTime } from 'rxjs/operators';

export interface StickyPositions {
  offsetY: number;
  bottomBoundary: number | null;
  upperScreenEdgeAt?: number;
  marginTop?: number;
  marginBottom?: number;
}

export interface StickyStatus {
  isSticky: boolean;
  reachedUpperEdge: boolean;
  reachedLowerEdge: boolean;
  marginTop?: number;
  marginBottom?: number;
}

@Directive({
  selector: '[sticky]'
})
export class StickyDirective implements OnInit, AfterViewInit, OnDestroy {

  filterGate = false;
  marginTop$ = new BehaviorSubject(0);
  marginBottom$ = new BehaviorSubject(0);
  enable$ = new BehaviorSubject(true);

  @Input() scrollContainer: string | HTMLElement | undefined;

  @Input('spacer') spacer: HTMLElement | undefined;
  @Input('boundary') boundary: HTMLElement | undefined;

  @Input() auditTime = 0;
  @Input() set marginTop(value: number) {
    this.marginTop$.next(value);
  }

  @Input() set marginBottom(value: number) {
    this.marginBottom$.next(value);
  }

  @Input() set enable(value: boolean) {
    this.enable$.next(value);
  }
  sticky = false;
  @HostBinding('class.is-sticky') isSticky = false;
  @HostBinding('class.boundary-reached') boundaryReached = false;
  @HostBinding('class.upper-bound-reached') upperBoundReached = false;
  @Output() stickyStatus: EventEmitter<StickyStatus> = new EventEmitter<StickyStatus>();
  @Output() stickyPosition: EventEmitter<StickyPositions> = new EventEmitter<StickyPositions>();

  private scroll$ = new Subject<number>();
  private scrollThrottled$!: Observable<number>;
  private target = this.getScrollTarget();

  private resize$ = new Subject<void>();
  private resizeThrottled$!: Observable<void>;
  private extraordinaryChange$ = new BehaviorSubject<void>(undefined);

  private status$!: Observable<StickyStatus>;

  private componentDestroyed = new Subject<void>();
  private elementOffsetY!: number;

  constructor(
    private stickyElement: ElementRef,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
  }

  ngAfterViewInit(): void {
    const operators = this.scrollContainer ?
      pipe(takeUntil(this.componentDestroyed)) :
      pipe(auditTime(this.auditTime), takeUntil(this.componentDestroyed));
    this.status$
      .pipe(operators)
      .subscribe((status: any) => { // StickyStatus
        this.setSticky(status);
        this.setStatus(status);
      });
  }

  public recalculate(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.extraordinaryChange$.next(undefined);
      }, 0);
    }
  }

  checkEnabled(enabled: boolean): boolean {

    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    if (enabled) {
      this.filterGate = false;
      return true;
    } else {
      if (this.filterGate) {
        return false;
      } else {
        this.filterGate = true;
        return true;
      }
    }
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.resize$.next();
    }
  }

  setupListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      const target = this.getScrollTarget();
      target.addEventListener('scroll', this.listener);
    }
  }

  listener = (e: Event) => {
    const upperScreenEdgeAt = (e.target as HTMLElement).scrollTop || window.pageYOffset;
    this.scroll$.next(upperScreenEdgeAt);
  }


  async ngOnInit(): Promise<void> {

    const aFrame = animationFrameScheduler;

    this.scrollThrottled$ = this.scroll$
      .pipe(
        throttleTime(0, aFrame),
        share()
      );

    this.resizeThrottled$ = this.resize$
      .pipe(
        throttleTime(0, aFrame),
        // emit once since we are currently using combineLatest
        startWith(undefined),
        share()
      );


    this.status$ = combineLatest([
      this.enable$,
      this.scrollThrottled$,
      this.marginTop$,
      this.marginBottom$,
      this.extraordinaryChange$,
      this.resizeThrottled$,
    ])
      .pipe(
        filter(([enabled]) => this.checkEnabled(enabled)),

        map(([enabled, pageYOffset, marginTop, marginBottom]) =>
          this.determineStatus(this.determineElementOffsets(), pageYOffset, marginTop, marginBottom, enabled)),
        share(),
      );

    this.checkSetup();
    this.setupListener();
    this.elementOffsetY = this.determineElementOffsets().offsetY;
  }

  ngOnDestroy(): void {
    this.target.removeEventListener('scroll', this.listener);
    this.componentDestroyed.next();
  }

  private getScrollTarget(): Element | Window {
    let target: Element | Window;
    if (this.scrollContainer && typeof this.scrollContainer === 'string') {
      target = document.querySelector(this.scrollContainer) as Element;
      this.marginTop$.next(Infinity);
      this.auditTime = 0;
    } else if (this.scrollContainer && this.scrollContainer instanceof HTMLElement) {
      target = this.scrollContainer;
      this.marginTop$.next(Infinity);
      this.auditTime = 0;
    } else {
      target = window;
    }
    return target;
  }
  getComputedStyle(el: HTMLElement): ClientRect | DOMRect {
    return el.getBoundingClientRect();
  }

  private determineStatus(originalVals: StickyPositions, pageYOffset: number, marginTop: number, marginBottom: number, enabled: boolean) {
    const elementPos = this.determineElementOffsets();
    let isSticky = enabled && pageYOffset > originalVals.offsetY;
    if (pageYOffset < this.elementOffsetY) {
      isSticky = false;
    }
    const stickyElementHeight = this.getComputedStyle(this.stickyElement.nativeElement).height;

    const reachedLowerEdge = (this.boundary != null) ?
      this.boundary && window.pageYOffset + stickyElementHeight + marginBottom >= (originalVals.bottomBoundary as number - marginTop * 1.0)
      : false;

    const reachedUpperEdge = (this.boundary != null)
      ? window.pageYOffset < (this.boundary.offsetTop + marginTop * 1.0)
      : false;
    this.stickyPosition.emit({ ...elementPos, upperScreenEdgeAt: pageYOffset, marginBottom, marginTop });
    return {
      isSticky,
      reachedUpperEdge,
      reachedLowerEdge,
    };

  }

  private getMargins(): { top: number, bottom: number } {
    const stickyStyles = window.getComputedStyle(this.stickyElement.nativeElement);
    const top = parseInt(stickyStyles.marginTop, 10);
    const bottom = parseInt(stickyStyles.marginBottom, 10);
    return { top, bottom };
  }

  private determineElementOffsets(): StickyPositions {
    if (this.sticky) {
      this.removeSticky();
    }
    let bottomBoundary: number | null = null;

    if (this.boundary) {
      const boundaryElementHeight = this.getComputedStyle(this.boundary).height;
      const boundaryElementOffset = getPosition(this.boundary).y;
      bottomBoundary = boundaryElementHeight + boundaryElementOffset;
    }
    return {
      offsetY: (getPosition(this.stickyElement.nativeElement).y - this.marginTop$.value), bottomBoundary
    };
  }

  private makeSticky(boundaryReached: boolean = false, marginTop: number, marginBottom: number): void {
    const { width, height, left } = this.getComputedStyle(this.stickyElement.nativeElement);

    const offSet = boundaryReached
      ? (this.getComputedStyle(this.boundary as HTMLElement).bottom - height - this.marginBottom$.value)
      : this.marginTop$.value;

    if (this.scrollContainer && !this.sticky) {
      this.stickyElement.nativeElement.style.position = 'sticky';
      this.stickyElement.nativeElement.style.top = '0px';
      this.sticky = true;
    } else {
      this.stickyElement.nativeElement.style.position = 'fixed';
      this.stickyElement.nativeElement.style.top = offSet + 'px';
      this.stickyElement.nativeElement.style.left = left + 'px';
      this.stickyElement.nativeElement.style.width = `${width}px`;
    }
    if (this.spacer) {
      const spacerHeight = marginBottom + height + marginTop;
      this.spacer.style.height = `${spacerHeight}px`;
    }
  }


  private determineBoundaryReached(
    boundaryHeight: number,
    stickyElHeight: number,
    cssMargins: any,
    marginTop: number,
    marginBottom: number,
    upperScreenEdgeAt: number
  ) {

    const boundaryElementPos = getPosition(this.boundary);

    const boundaryElementLowerEdge = boundaryElementPos.y + boundaryHeight;
    const lowerEdgeStickyElement = upperScreenEdgeAt + stickyElHeight + marginTop + cssMargins.top + marginBottom + cssMargins.bottom;

    return boundaryElementLowerEdge <= lowerEdgeStickyElement;
  }

  private checkSetup() {
    if (isDevMode() && !this.spacer) {
      console.warn(`******There might be an issue with your sticky directive!******

You haven't specified a spacer element. This will cause the page to jump.

Best practise is to provide a spacer element (e.g. a div) right before/after the sticky element.
Then pass the spacer element as input:

<div #spacer></div>

<div stickyThing="" [spacer]="spacer">
    I am sticky!
</div>`);
    }
  }


  private setSticky(status: StickyStatus): void {
    if (status.isSticky) {
      if (this.upperBoundReached) {
        this.removeSticky();
        this.isSticky = false;
      } else {
        this.makeSticky(status.reachedLowerEdge, status.marginTop as number, status.marginBottom as number);
        this.isSticky = true;
      }
    } else {
      this.removeSticky();
    }
  }

  private setStatus(status: StickyStatus) {
    this.upperBoundReached = status.reachedUpperEdge;
    this.boundaryReached = status.reachedLowerEdge;
    this.stickyStatus.next(status);
  }

  private removeSticky(): void {
    this.boundaryReached = false;
    this.sticky = false;
    this.stickyElement.nativeElement.style.position = '';
    this.stickyElement.nativeElement.style.width = 'auto';
    this.stickyElement.nativeElement.style.left = 'auto';
    this.stickyElement.nativeElement.style.top = 'auto';
    if (this.spacer) {
      this.spacer.style.height = '0';
    }
  }
}

function getPosition(el: any) {
  let top = 0;
  let left = 0;
  let element = el;

  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    y: top,
    x: left,
  };
}
