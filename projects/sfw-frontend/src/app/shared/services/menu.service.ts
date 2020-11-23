import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { Article } from '@article/_interfaces/article.interface';
import { MenuItem } from '@shared/_interfaces/menu-item.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuItems: any;

  constructor(
    private firestoreService: FirestoreService
  ) { }

  getArticleListForHeader(): Observable<Article[]> {
    return this.firestoreService.col<Article>(`articles`, (ref: Query) => {
      ref = ref.where('displayInMenu', '==', false);
      ref = ref.where('publication.status', '==', 1);
      ref = ref.orderBy('title', 'asc');
      return ref;
    }).valueChanges();
  }

  getArticlesForCategory(categoryTitle: string, limitTo?: number, displayInMenu?: boolean): Observable<Article[]> {
    return this.firestoreService.col<Article>(`articles`, (ref: Query) => {
      ref = ref.where('menuDisplay', '==', categoryTitle);
      ref = ref.where('publication.status', '==', 1);
      ref = displayInMenu ? ref.where('displayInMenu', '==', displayInMenu) : ref;
      ref = ref.orderBy('publication.at', 'desc');
      ref = limitTo ? ref.limit(limitTo) : ref;
      return ref;
    }).valueChanges().pipe(
      map((articles: Article[]) => {
        return articles.map(article => {
          return {
            ...article,
            link: `/${categoryTitle.toLowerCase()}/${article.id}`
          };
        });
      })
    );
  }

  getMenu(): Observable<MenuItem[]> {
    return this.firestoreService.doc<any>(`frontend-menu/current`).valueChanges().pipe(
      map((menu: MenuItem[]) => {
        if (!menu) {
          return [];
        }
        return menu
          .filter((item: MenuItem) => !!item && item.display)
          .sort((a: MenuItem, b: MenuItem) =>
            (a.ordering as number) > (b.ordering as number)
              ? 1
              : ((b.ordering as number) > (a.ordering as number))
                ? -1
                : 0
          )
          .map((item: MenuItem) => {
            return {
              ...item,
              subMenu: this.buildSubMenu(item),
              link: item.title?.toLowerCase(),
              fixedArticles$: this.getArticlesForCategory(item.title as string, undefined, true)
            };
          })
      })
    );
  }

  buildSubMenu(item: MenuItem) {
    if (!item.subMenu) {
      return null;
    }

    const subMenu = item.subMenu.sort((a: MenuItem, b: MenuItem) =>
      (a.ordering as number) > (b.ordering as number)
        ? 1
        : ((b.ordering as number) > (a.ordering as number))
          ? -1
          : 0);

    return subMenu.map((menu: MenuItem) => {
      return {
        ...menu,
        link: `/${item.title?.toLowerCase()}/${menu.link}`
      };
    });

  }

}
