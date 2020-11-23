import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Article } from '../../article/_interfaces/article.interface';
import { Category } from '../../category/_interfaces/category.interface';
import { SponsorService } from '../sponsor.service';
import { Sponsor } from '../_interfaces/sponsor.interface';

@Component({
  selector: 'sponsor-form',
  templateUrl: './sponsor-form.component.html'
})
export class SponsorFormComponent implements OnInit {

  sponsor$!: Observable<Sponsor>;
  articles$!: Observable<Article[]>;
  sponsor!: Sponsor;

  form!: FormGroup;
  categories$!: Observable<Category[]>;
  titleMaxLength = 50;
  savedSponsor!: Sponsor;
  hasFormErrors = false;
  gallery: any;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    private sponsorService: SponsorService
  ) {
  }

  ngOnInit(): void {
    this.form = this.sponsorService.getFormFields();

    this.sponsor$ = this.route.params.pipe(
      switchMap(params => this.sponsorService.get(params.sponsorId)),
      tap((sponsor: Sponsor) => {
        this.form.patchValue(sponsor);
        this.savedSponsor = Object.freeze(Object.assign({}, sponsor));
      })
    );

    this.categories$ = this.sponsorService.getSponsoringCategories();
  }

  public get assignedArticleControl() {
    return this.form.controls.assignedArticleIds;
  }

  public get descriptionControl() {
    return this.form.controls.description;
  }

  public get internalInfoControl() {
    return this.form.controls.internalInfo;
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.sponsorService.save(this.form.value as Sponsor).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  cancel() {
    return this.redirectToList();
  }

  redirectToList() {
    return this.router.navigate(['/sponsors']);
  }

  deleteSponsor(item: Sponsor) {
    this.firestoreService.removeItem('sponsors', item, 'sponsor', '/sponsors/list');
  }

  reset(): void {
    this.form.patchValue(this.savedSponsor);
  }

  onAlertClose(): void {
    this.hasFormErrors = false;
  }

  updateControl(path: any, value: any) {
    const control = this.form.controls[path];
    control.setValue(value);
    control.markAsDirty();
  }

}
