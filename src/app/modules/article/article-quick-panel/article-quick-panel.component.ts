import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs/public_api';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Category } from '../../category/_interfaces/category.interface';
import { OffcanvasOptions } from './../../../shared/directives/offcanvas.directive';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { CategoryService } from './../../category/category.service';
import { ArticleService } from './../article.service';
import { Article } from './../_interfaces/article.interface';

@Component({
  selector: 'article-quick-panel',
  templateUrl: './article-quick-panel.component.html',
  styleUrls: ['./article-quick-panel.component.scss']
})
export class ArticleQuickPanelComponent implements OnInit {

  @Input() form!: FormGroup;

  @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;

  article!: Article;
  article$!: Observable<Article>;
  categories$!: Observable<Category[]>;

  step = 0;
  panels = [
    // { title: 'main', icon: 'fas fa-info' },
    { title: 'facebook', icon: 'fab fa-facebook-f', description: 'Auf der Fanpage veröffentlichen?' },
    { title: 'twitter', icon: 'fab fa-twitter', description: 'Auf der Twitter-Page veröffentlichen?' },
    // { title: 'instagram', icon: 'fab fa-instagram' },
  ];

  offCanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: 'app-quick-panel',
    closeBy: 'article_quick_panel_close_btn',
    toggleBy: 'article_quick_panel_toggler_btn'
  };

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.article$ = this.route.params.pipe(
      switchMap((params: any) => this.articleService.get(params.articleId)),
      tap((article: Article) => this.article = article)
    );
    this.categories$ = this.categoryService.getCategoryListByParentCategoryTitle('Homepage-Menü');
  }

  selectTab(tabId: number): void {
    this.staticTabs.tabs[tabId].active = true;
  }

  public get facebookPostModeControl(): AbstractControl {
    return this.form.get('meta.facebook.mode') as AbstractControl;
  }

  public get facebookDescriptionControl(): AbstractControl {
    return this.form.get('meta.facebook.description') as AbstractControl;
  }


  public get assignedAuthorControl() {
    return (this.form.controls.creation as any).controls.by;
  }

  public get assignedLocationsControl() {
    return this.form.controls.assignedLocationIds;
  }

  public get assignedTeamsControl() {
    return this.form.controls.assignedTeamIds;
  }

  public get assignedCategoriesControl() {
    return this.form.controls.assignedCategoryIds;
  }

  public get assignedMatchesControl() {
    return this.form.controls.assignedMatchIds;
  }

  public get excerptControl() {
    return this.form.controls.excerpt;
  }

  setStep(index: number): void {
    this.step = index;
  }

  deleteArticle(item: Article): void {
    this.firestoreService.removeItem('articles', item, '/articles/list');
  }

  updateControl(path: string, value: string): void {
    const control = this.form.get(path);
    control?.setValue(value);
    control?.markAsDirty();
  }

}
