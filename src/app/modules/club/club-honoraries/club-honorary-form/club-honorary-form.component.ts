import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ClubHonorary } from '../../_interfaces/club-honorary.interface';
import { ClubHonorariesService } from './../club-honoraries.service';

@Component({
  selector: 'app-club-honorary-form',
  templateUrl: './club-honorary-form.component.html',
  styleUrls: ['./club-honorary-form.component.scss']
})
export class ClubHonoraryFormComponent implements OnInit {

  form!: FormGroup;

  honorary$!: Observable<ClubHonorary>;
  savedHonorary!: ClubHonorary;
  hasFormErrors = false;

  constructor(
    private clubHonorariesService: ClubHonorariesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.form = this.clubHonorariesService.getHonoraryFormFields();

    this.honorary$ = this.route.params.pipe(
      switchMap(params => this.clubHonorariesService.getHonorary(params.honoraryId)),
      tap((honorary: ClubHonorary) => {
        this.form.patchValue(honorary);
        this.savedHonorary = Object.freeze(Object.assign({}, honorary));
      })
    );
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.clubHonorariesService.saveHonorary(this.form.value as ClubHonorary).then(() => {
      if (withBack) {
        this.redirectToList();
      }
    });
  }

  redirectToList() {
    this.router.navigate(['/club/honoraries']).then();
  }

  get assignedArticleControl() {
    return this.form.controls.assignedArticleId;
  }


}
