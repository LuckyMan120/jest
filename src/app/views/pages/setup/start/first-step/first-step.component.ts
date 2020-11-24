import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Config } from '@shared/_interfaces/config.interface';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { defaults } from './../../../../../../environments/defaults';

@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss']
})
export class FirstStepComponent implements OnInit, OnDestroy {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  roles!: string[];
  visibleRole = true;
  selectableRole = true;
  removableRole = false;

  permissions!: string[];
  visiblePermission = true;
  selectablePermission = true;
  removablePermission = false;

  communities!: string[];
  visibleCommunity = true;
  selectableCommunity = true;
  removableCommunity = true;

  addOnBlur = true;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  config$!: Observable<Config | undefined>;

  error!: {
    code: string;
    message: string;
  };

  form!: FormGroup;
  sub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fns: AngularFireFunctions
  ) { }

  ngOnInit(): void {

    const startDate = new Date();
    startDate.setMonth(6);
    startDate.setDate(1);

    console.log(defaults);

    this.form = this.fb.group({
      algolia: this.fb.group({
        id: [defaults.algolia.id || ''],
        key: [defaults.algolia.key || '']
      }),
      communities: [],
      dfbnet: this.fb.group({
        username: defaults.dfbnet.username || '',
        password: defaults.dfbnet.password || ''
      }),
      fussball: this.fb.group({
        clubId: [defaults.fussball.clubId || '', [Validators.required]],
        endDateOffset: [defaults.fussball.endDateOffset,
        [Validators.required, Validators.min(1), Validators.max(12)]
        ],
        startDate,
      }),
      memberSheetId: defaults.memberSheetId || '',
      mailjet: this.fb.group({
        key: [defaults.mailjet.key || ''],
        secret: [defaults.mailjet.secret || ''],
      }),
      permissions: [[], [Validators.required]],
      roles: [[], [Validators.required]],
      slackWebHookUrl: defaults.slackWebHookUrl || '',
      uppy: this.fb.group({
        companionUrl: defaults.uppy.companionUrl,
        facebook: defaults.uppy.facebook,
        instagram: defaults.uppy.instagram,
        googleDrive: defaults.uppy.googleDrive,
        oneDrive: defaults.uppy.oneDrive,
        zoom: defaults.uppy.zoom,
        dropbox: defaults.uppy.dropbox,
        url: defaults.uppy.url,
        unsplash: defaults.uppy.unsplash
      })
    });

    this.communities = defaults.communities;
    this.permissions = defaults.permissions;
    this.roles = defaults.roles;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  async onSubmit(): Promise<boolean> {

    this.form.patchValue({ communities: this.communities });
    this.form.patchValue({ permissions: this.permissions });
    this.form.patchValue({ roles: this.roles });

    if (!this.form.valid) {
      of(undefined);
    }
    const data = this.form.value;

    const startDate = this.form.get('fussball.startDate')?.value as Date;
    data.fussball.startDate = startDate.valueOf();

    this.isLoading$.next(true);

    const result = await this.fns.httpsCallable('callSetupStep1')(data).toPromise();
    this.isLoading$.next(false);
    if (result.success) {
      return this.router.navigate(['/setup/step-2']);
    } else {
      return this.error = result.error;
    }
  }

  add(event: MatChipInputEvent, type: 'roles' | 'permissions' | 'communities'): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {

      /* const newItem =
        type === 'roles' ? { title: value, isCoreRole: false }
          : type === 'permissions' ? { title: value, isCorePermission: false }
            : value; */

      this[type].push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(item: string, type: 'roles' | 'permissions' | 'communities'): void {

    const index = this[type].indexOf(item);

    /*  type === 'roles' ? this.roles.indexOf(item)
        : type === 'permissions' ? this.permissions.indexOf(item)
          : this.communities.indexOf(item); */

    if (index >= 0) {
      this[type].splice(index, 1);
    }
  }

}
