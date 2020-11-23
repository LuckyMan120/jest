import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../_interfaces/article.interface';

@Component({
  selector: 'app-latest-article',
  templateUrl: './latest-article.component.html',
  styleUrls: ['./latest-article.component.scss']
})
export class LatestArticleComponent implements OnInit {

  @Input() article!: Article;
  @Input() chars = 180;

  constructor() { }

  ngOnInit() {
  }

}
