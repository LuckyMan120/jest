import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../app/views/pages/auth/auth.service';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Article } from './_interfaces/article.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
  }

  public get(id: string): Observable<Article> {
    if (!!!id) {
      return this.initNewArticle();
    } else {
      return this.loadArticle(id);
    }
  }

  public stripHtml(html: string) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  public getTotalArticleCount(): Observable<number> {
    return this.firestoreService.doc<number>('statistics/currentApplication')?.valueChanges().pipe(
      map((statistics: any) => {
        console.log(statistics.articleCount);
        return statistics.articleCount;
      })
    );
  }

  public getArticlePublicationStatistics(): Observable<any> {
    console.log('TODO');

    return of([]);
    /* return this.firestoreService.col<{ count: number }>('article-statistics')?.valueChanges().pipe(
     map((statistics: { title: string, count: number }[]) => {
       const data = {
         labels: [],
         datasets: []
       };
       statistics.forEach(stats => {
         data.labels.push('article.publication.status.' + stats.title);
         data.datasets.push(stats.count);
       });
       return data;
     })
   ); */
  }

  public getLatestPublishedArticles(limit: number = 1): Observable<Article[]> {
    return this.firestoreService.col<Article>(`articles`, (ref: Query) => {
      ref = ref.where('publication.at', '<=', new Date().valueOf());
      return ref.orderBy('publication.at', 'desc').limit(limit);
    }).valueChanges();
  }

  private loadArticle(id: string): Observable<Article> {
    return this.firestoreService.doc$<Article>(`articles/${id}`).pipe(
      map((article: Article) => {
        return {
          ...article,
          articleDate: article.articleDate ? new Date(article.articleDate) as any : null,
          creation: this.firestoreService.getCreation(article),
          publication: this.firestoreService.getPublication(article),
          modification: this.firestoreService.getModification(article),
          meta: this.firestoreService.getMeta(article)
        };
      })
    );
  }

  private initNewArticle(): Observable<Article> {
    return this.authService.authUser$.pipe(
      map(user => {
        return {
          title: '',
          excerpt: '',
          text: '',
          articleDate: new Date() as any,
          isFeaturedPost: false,
          displayInFooter: false,
          displayInBackendFooter: false,
          displayInArticleList: true,
          assignedCategoryIds: [],
          displayInMenu: false,
          menuDisplay: false,
          displayInClubFooter: false,
          assignedTeamIds: [],
          assignedMatchIds: [],
          assignedLocationIds: [],
          creation: this.firestoreService.getCreation({}, user),
          publication: this.firestoreService.getPublication({}, user),
          modification: this.firestoreService.getModification({}, { by: user, change: 'NEW' }),
          galleries: {
            Artikelbilder: {
              title: 'Artikelbilder'
            }
          },
          meta: this.firestoreService.getMeta({})
        };
      })
    );
  }

  public getFormFields(): FormGroup {
    return this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      excerpt: null,
      subTitle: null,
      articleDate: null,
      text: null,
      creation: this.firestoreService.initCreationFormGroup(),
      publication: this.firestoreService.initPublicationFormGroup(),
      modification: this.firestoreService.initModificationFormArray(),
      galleries: {},
      image: null,
      id: [null],
      assignedTags: null,
      isFeaturedPost: null,
      displayInFooter: null,
      displayInMenu: null,
      menuDisplay: null,
      displayInClubFooter: null,
      displayInBackendFooter: null,
      displayInArticleList: null,
      assignedCategoryIds: null,
      assignedTeamIds: null,
      assignedMatchIds: null,
      assignedLocationIds: null,
      meta: this.firestoreService.initMetaFormGroup()
    });
  }

  public async save(article: Article): Promise<string> {
    if (article.articleDate) {
      article.articleDate = article.articleDate.valueOf();
    }
    return this.firestoreService.save(article, 'articles', 'article');
  }

}
