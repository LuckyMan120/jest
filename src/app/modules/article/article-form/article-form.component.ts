import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ArticleService } from '../article.service';
import { Article } from '../_interfaces/article.interface';
import { AuthService } from './../../../views/pages/auth/auth.service';

@Component({
  selector: 'article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit {

  form!: FormGroup;
  article$!: Observable<Article>;
  savedArticle!: Article;
  hasFormErrors = false;
  now!: Date;

  public publicationOptions: any[] = [
    {
      text: 'Als Entwurf',
      description: 'Dein Entwurf bleibt hier gespeichert, ist allerdings nicht auf der Homepage sichtbar.',
      value: 0,
      showDateInput: false
    },
    {
      text: 'Jetzt veröffentlichen',
      description: 'Dein Artikel wird unmittelbar nach dem Speichern auf der Homepage sichtbar.',
      value: 1,
      showDateInput: false
    },
    {
      text: 'Veröffentlichung planen',
      description: 'Bitte wählen das Datum und eine Uhrzeit, wann der Artikel veröffentlicht werden soll.',
      value: 2,
      showDateInput: true
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.now = new Date(this.roundUpTo(new Date(), 1000 * 60 * 15));
    this.form = this.articleService.getFormFields();

    this.article$ = this.route.params.pipe(
      switchMap(params => this.articleService.get(params.articleId)),
      tap((article: Article) => {
        this.form.patchValue(article);
        this.savedArticle = Object.freeze(Object.assign({}, article));
      })
    );
  }

  public get textControl() {
    return this.form.controls.text;
  }

  roundUpTo(x: any, roundTo: number) {
    return Math.ceil(x / roundTo) * roundTo;
  }

  getPublicationStatus($event: number) {
    this.form.get('publication.status')?.setValue($event);
    switch ($event) {
      case 0:
        this.form.get('publication.at')?.setValue(null);
        this.form.get('publication.by')?.setValue(null);
        break;
      case 1:
      case 2:
        this.form.get('publication.by')?.setValue(this.authService.authUserId);
        this.form.get('publication.at')?.setValue($event === 1 ? new Date() : this.now);
        break;
    }
  }

  onSubmit(withBack: boolean = true) {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }
    this.articleService.save(this.form.getRawValue() as Article).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  redirectToList() {
    return this.router.navigate(['/articles/list']);
  }

}
