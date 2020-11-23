import { Component, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { Application } from '@application/_interfaces/application.interface';
import { LinkFilter } from '@application/_interfaces/link-filter.interface';
import { Article } from '@article/_interfaces/article.interface';
import { MenuItem } from '@shared/_interfaces/menu-item.interface';
import { Observable } from 'rxjs';
import { MenuService } from '../../shared/services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() application!: Application;

  isOpen = false;
  isMegaMenuOpen = false;

  socialLinks: LinkFilter = { title: 'Links zu sozialen Netzwerken', displayIn: 'displayInHeader' };
  articles$!: Observable<Article[] | undefined>;
  menuItems$!: Observable<MenuItem[]>;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    const headerElement = document.getElementsByClassName('header')[0];
    if (window.pageYOffset >= 100) {
      this.renderer.addClass(headerElement, 'darkHeader');
    } else {
      this.renderer.removeClass(headerElement, 'darkHeader');
    }
  }

  constructor(
    private menuService: MenuService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {

    this.articles$ = this.menuService.getArticleListForHeader();
    this.menuItems$ = this.menuService.getMenu();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    const elem = document.querySelector('html');
    this.isOpen ? this.renderer.setAttribute(elem, 'class', 'menu-page') : this.renderer.removeAttribute(elem, 'class');
  }

  openMegaMenu() {
    this.isMegaMenuOpen = !this.isMegaMenuOpen;
  }

}

