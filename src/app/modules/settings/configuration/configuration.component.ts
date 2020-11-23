import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Config } from '../../../shared/_interfaces/config.interface';
import { ApplicationService } from './../application.service';
import { SettingService } from './../setting.service';

@Component({

  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  config$!: Observable<Config | undefined>;

  savedConfig!: Config;
  hasFormErrors = false;
  form!: FormGroup;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  communities!: string[];
  visibleCommunity = true;
  selectableCommunity = true;
  removableCommunity = true;

  addOnBlur = true;

  constructor(
    private settingsService: SettingService,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.form = this.settingsService.getConfigForm();

    this.config$ = this.applicationService.getConfig().pipe(
      tap(cfg => {
        this.communities = cfg?.communities || [];
        this.form.patchValue({
          ...cfg,
          fussball: { ...cfg?.fussball, startDate: new Date(cfg?.fussball.startDate as number) || new Date() }
        });
      })
    );
  }

  onAlertClose(): void {
    this.hasFormErrors = false;
  }

  onSubmit() {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }
    this.settingsService.saveConfig(this.form.value as Config);
  }

  reset(): void {
    this.form.patchValue(this.savedConfig);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.communities.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(item: string): void {
    const index = this.communities.indexOf(item as string);
    if (index >= 0) {
      this.communities.splice(index, 1);
    }
  }

}
