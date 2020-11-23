import { Component, Input, OnInit } from '@angular/core';
import { Application } from '@application/_interfaces/application.interface';
import { LinkFilter } from '@application/_interfaces/link-filter.interface';
import { Article } from '@article/_interfaces/article.interface';
import { Observable } from 'rxjs';
import { ThemeService } from './../theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  @Input() application!: Application;

  footerArticles$!: Observable<Article[]>;
  clubFooterArticles$!: Observable<Article[]>;

  externLinks: LinkFilter = { title: 'Externe Footerlinks', displayIn: 'displayInFooter' };
  socialLinks: LinkFilter = { title: 'Links zu sozialen Netzwerken', displayIn: 'displayInFooter' };

  constructor(
    private themeService: ThemeService
  ) {
  }

  ngOnInit() {
    this.footerArticles$ = this.themeService.getArticleListForFooter('footer');
    this.clubFooterArticles$ = this.themeService.getArticleListForFooter('clubFooter');
  }

}
