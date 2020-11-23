import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { Article } from '@article/_interfaces/article.interface';
import { Match } from '@match/_interfaces/match.interface';
import { Sponsor } from '@sponsor/_interfaces/sponsor.interface';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemeService } from './../../../theme/theme.service';

@Injectable({
  providedIn: 'root'
})
export class StartService {

  public articleImagePlaceholders = [
    'articles/97.jpg',
    'articles/99.jpg',
  ];

  constructor(
    private themeService: ThemeService
  ) {
  }

  public getItemList(
    type: string,
    whereArgs: Article | Sponsor | Match,
    orderBy: { field: string, value: firebase.firestore.OrderByDirection },
    limit?: number | undefined
  ): Observable<any[]> {
    return this.themeService.col<any>(type, (ref: Query) => {
      for (const [key, value] of Object.entries(whereArgs)) {
        ref = ref.where(key, value.operator, value.value);
      }
      if (limit) {
        ref = ref.limit(limit);
      }
      if (orderBy) {
        ref = ref.orderBy(orderBy.field, orderBy.value);
      }
      return ref;
    }).valueChanges();
  }

  public loadArticleByTitle(title: string): Observable<Article | undefined> {
    return this.themeService.col<Article>(`articles`, (ref: Query) => ref.where('title', '==', title)).valueChanges().pipe(
      map(articles => !articles || articles.length === 0 ? undefined : articles[0])
    );
  }

}
