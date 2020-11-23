import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Article } from '../../../../modules/article/_interfaces/article.interface';
import { FirestoreService } from '../../../services/firestore.service';
import { TimeLineService } from '../timline.service';
import { TimeLineEvent } from '../_interfaces/time-line-event.interface';

@Component({

  selector: 'app-timeline-form',
  templateUrl: './timeline-form.component.html',
  styleUrls: ['./timeline-form.component.scss']
})
export class TimelineFormComponent implements OnInit {

  @ViewChild('picker') picker: any;

  event$!: Observable<TimeLineEvent | undefined>;
  event!: TimeLineEvent;
  savedEvent!: TimeLineEvent;

  data$!: Observable<Data>;
  data!: {
    type: string;
    title: string;
    id: string
  };

  articles$!: Observable<Article[]>;

  form!: FormGroup;
  hasFormErrors = false;

  colours: string[] = ['primary', 'secondary', 'warning', 'brand', 'success', 'error', 'info'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private timeLineService: TimeLineService
  ) {
  }

  ngOnInit() {
    this.form = this.timeLineService.getFormFields();

    this.data$ = this.route.data.pipe(map(data => this.data = data.data));

    this.event$ = this.route.params.pipe(
      switchMap(params => this.timeLineService.get(params.eventId)),
      tap((event: TimeLineEvent) => {
        this.form.patchValue(event);
        this.savedEvent = Object.freeze(Object.assign({}, event));
      })
    );

    this.articles$ = this.firestoreService.col$('articles');
  }

  public get assignedArticleControl() {
    return this.form.controls.assignedArticleId;
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    const data = this.form.getRawValue() as TimeLineEvent;
    data.assignedType = this.data.type;
    data.assignedObjectId = this.data.id;

    this.timeLineService.save(data).then(() => {
      if (withBack) {
        this.redirectToList();
      }
    });
  }

  redirectToList(): void {
    this.router.navigate([this.data.type + '/timeline']);
  }

}
