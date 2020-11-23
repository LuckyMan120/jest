import { Component, OnInit } from '@angular/core';
import { Article } from '@article/_interfaces/article.interface';
import { Observable } from 'rxjs';
import { StartService } from './../start.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
})
export class NewsListComponent implements OnInit {

  articles$!: Observable<Article[]>;
  imagePlaceholders!: string[];

  constructor(
    private startService: StartService
  ) { }

  ngOnInit() {

    const args = {
      isFeaturedPost: { value: false, operator: '==' },
      displayInArticleList: { value: true, operator: '==' },
      'publication.status': { value: 1, operator: '==' }
    } as any;

    this.articles$ = this.startService.getItemList('articles', args, { field: 'publication.at', value: 'desc' }, 6);
    /* .pipe(
      tap(articles => console.log(1, articles)),
      tap(articles => articles.splice(0, 3))
    ) */

    this.imagePlaceholders = this.startService.articleImagePlaceholders.map(placeholder => {
      return '/assets/images/placeholders/' + placeholder;
    });
  }

}
