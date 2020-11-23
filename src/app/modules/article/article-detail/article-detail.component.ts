import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ArticleService } from '../article.service';
import { Article } from '../_interfaces/article.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

  public article$!: Observable<Article | undefined>;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private articleService: ArticleService
  ) {
  }

  ngOnInit() {
    this.article$ = this.route.params.pipe(
      switchMap(params => this.articleService.get(params.articleId))
    );
  }

  deleteArticle(item: Article) {
    this.firestoreService.removeItem('articles', item, 'article', '/articles/list');
  }

  public getArticleCategoryTitle(article: Article, idx: number): string {
    if (article && article.assignedCategoryTitles && article.assignedCategoryTitles[idx]) {
      return article.assignedCategoryTitles[idx];
    }
    return '';
  }

  public getArticleMatchTitle(article: Article, idx: number): string {
    if (article && article.assignedMatchTitles && article.assignedMatchTitles[idx]) {
      return article.assignedMatchTitles[idx];
    }
    return '';
  }

  public getArticleTeamTitle(article: Article, idx: number): string {
    if (article && article.assignedTeamTitles && article.assignedTeamTitles[idx]) {
      return article.assignedTeamTitles[idx];
    }
    return '';
  }

  public getArticleLocationTitle(article: Article, idx: number): string {
    if (article && article.assignedLocationTitles && article.assignedLocationTitles[idx]) {
      return article.assignedLocationTitles[idx];
    }
    return '';
  }
}
