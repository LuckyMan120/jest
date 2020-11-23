import { Component, OnInit } from '@angular/core';
import { Article } from '@article/_interfaces/article.interface';
import { Observable } from 'rxjs';
import { StartService } from './../start.service';

@Component({
  selector: 'app-top-news',
  templateUrl: './top-news.component.html',
  styleUrls: ['./top-news.component.scss'],
})
export class TopNewsComponent implements OnInit {

  articles$!: Observable<Article[]>;
  imagePlaceholders!: string[];

  slideConfig = {
    dots: false,
    arrows: true,
    autoplay: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<a class="arrow-next"></a>',
    prevArrow: '<a class="arrow-prev"></a>'
  };

  constructor(
    private startService: StartService
  ) { }

  ngOnInit() {

    const args = {
      isFeaturedPost: { value: true, operator: '==' },
      displayInArticleList: { value: true, operator: '==' },
      'publication.status': { value: 1, operator: '==' }
    } as any;

    this.articles$ = this.startService.getItemList('articles', args, { field: 'publication.at', value: 'desc' }, 3);

    this.imagePlaceholders = this.startService.articleImagePlaceholders.map(placeholder => {
      return '/assets/images/placeholders/' + placeholder;
    });

  }

}
