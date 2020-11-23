import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClubService } from '../club.service';
import { Club } from '../_interfaces/club.interface';

@Component({
  selector: 'club-form',
  templateUrl: 'club-form.component.html',
  styleUrls: ['./club-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubFormComponent implements OnInit {

  club$!: Observable<Club>;

  form!: FormGroup;
  hasFormErrors = false;
  savedClub!: Club;

  constructor(
    private clubService: ClubService
  ) {
  }

  public get assignedLocationControl() {
    return this.form.controls.assignedLocationIds;
  }

  public get managementImageDescriptionControl() {
    return this.form.controls.managementImageDescription;
  }

  ngOnInit() {
    this.form = this.clubService.getFormFields();

    this.club$ = this.clubService.getCurrentClub().pipe(
      tap((club: Club) => {
        this.form.patchValue(club);
        this.savedClub = Object.freeze(Object.assign({}, club));
      })
    );
  }

  onSubmit(): Promise<string | void> | undefined {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }
    return this.clubService.save(this.form.value as Club);
  }

  resetForm() {
    this.form.patchValue(this.savedClub);
  }

  updateControl(path: string, value: any) {
    const control = this.form.controls[path];
    control.setValue(value);
    control.markAsDirty();
  }

}
