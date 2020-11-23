import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore.service';
import { TimeLineEvent } from './_interfaces/time-line-event.interface';


@Injectable()
export class TimeLineService {

  private collectionTitle = 'timeline';

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder) {
  }

  public async save(item: TimeLineEvent) {
    item.startDate = item.startDate.valueOf();
    if (item.endDate) {
      item.endDate = item.endDate.valueOf();
    }
    return this.firestoreService.save(item, this.collectionTitle, `${item.assignedType}-${this.collectionTitle}`);
  }

  public get(id: string): Observable<TimeLineEvent> {
    if (!!!id) {
      return this.initNewTimeLineEvent();
    } else {
      return this.loadTimeLineEvent(id);
    }
  }

  public getEvents(type: string, id: string): Observable<TimeLineEvent[]> {
    return this.firestoreService.col$<TimeLineEvent>(this.collectionTitle, (query: any) => {
      query = query.where('assignedObjectId', '==', id);
      query = query.where('assignedType', '==', type);
      return query;
    }).pipe(
      map((events: TimeLineEvent[]) => {
        return events.map(event => {
          return {
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate as number)
          };
        });
      })
    );
  }

  public getFormFields() {
    return this.fb.group({
      title: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      subTitle: null,
      startDate: [null, [Validators.required]],
      endDate: null,
      icon: null,
      colour: null,
      assignedArticleId: [null, [Validators.required]],
      id: [null],
      assignedObjectId: null,
      assignedType: null
    });
  }

  private loadTimeLineEvent(id: string) {
    return this.firestoreService.doc$<TimeLineEvent>(`${this.collectionTitle}/${id}`).pipe(
      map((event: TimeLineEvent) => {
        return {
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate as number)
        };
      })
    );
  }

  private initNewTimeLineEvent(): Observable<TimeLineEvent> {
    return of({
      title: '',
      subTitle: '',
      startDate: new Date(),
      icon: '',
      colour: ''
    });
  }

}
