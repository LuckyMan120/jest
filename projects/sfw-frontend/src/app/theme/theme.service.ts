import { Injectable } from '@angular/core';
import {
  Action, AngularFirestore, AngularFirestoreCollection,
  AngularFirestoreDocument, DocumentChangeAction, DocumentSnapshot, Query
} from '@angular/fire/firestore';
import { Application } from '@application/_interfaces/application.interface';
import { Article } from '@article/_interfaces/article.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
export type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  currentApplication$!: Observable<Application | undefined>;

  constructor(
    private afs: AngularFirestore
  ) { }

  public setCurrentApplication(): void {
    this.currentApplication$ = this.afs.doc<Application>('applications/currentApplication').valueChanges();
  }

  public getCurrentApplication(): Observable<Application | undefined> {
    if (!this.currentApplication$) {
      this.setCurrentApplication();
    }
    return this.currentApplication$;
  }

  public getArticleListForFooter(footerOrClubFooter: 'footer' | 'clubFooter'): Observable<Article[]> {
    return this.col<Article>(`articles`, (ref: Query) => {
      ref = footerOrClubFooter === 'footer' ? ref.where('displayInFooter', '==', true) : ref.where('displayInClubFooter', '==', true);
      ref = ref.where('publication.status', '==', 1);
      ref = ref.orderBy('title', 'asc');
      return ref;
    }).valueChanges();
  }


  public col<T>(ref: CollectionPredicate<T>, queryFn?: any): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  public doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  public doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc<T>(ref).snapshotChanges().pipe(
      map((doc: Action<DocumentSnapshot<T>>) => doc.payload.data() as T)
    );
  }

  public col$<T>(ref: CollectionPredicate<T>, queryFn?: any): Observable<T[]> {
    return this.col<T>(ref, queryFn).snapshotChanges().pipe(
      map((docs: DocumentChangeAction<T>[]) => docs.map(a => a.payload.doc.data()) as T[])
    );
  }

}
