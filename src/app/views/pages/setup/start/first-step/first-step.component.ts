import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Role } from '../../../../../modules/role/_interfaces/role.interface';
import { environment } from './../../../../../../environments/environment';
import { Category } from './../../../../../modules/category/_interfaces/category.interface';
import { Permission } from './../../../../../modules/permission/_interfaces/permission.interface';
import { Config } from './../../../../../shared/_interfaces/config.interface';

@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss']
})
export class FirstStepComponent implements OnInit, OnDestroy {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  roles!: Role[];
  visibleRole = true;
  selectableRole = true;
  removableRole = false;

  permissions!: Permission[];
  visiblePermission = true;
  selectablePermission = true;
  removablePermission = false;

  categories!: Category[];
  visibleCategory = true;
  selectableCategory = true;
  removableCategory = false;

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

    this.form = this.fb.group({
      algolia: this.fb.group({
        id: [environment.appDefaults.algolia.id || ''],
        key: [environment.appDefaults.algolia.key || '']
      }),
      communities: [],
      dfbnet: this.fb.group({
        username: environment.appDefaults.dfbnet.user || '',
        password: environment.appDefaults.dfbnet.password || ''
      }),
      fussball: this.fb.group({
        clubId: [environment.appDefaults.fussballId || '', [Validators.required]],
        endDateOffset: [12, [Validators.required, Validators.min(1), Validators.max(12)]],
        startDate,
      }),
      googleDriveMemberSheet: environment.appDefaults.memberSheetId || '',
      mailjet: this.fb.group({
        key: [environment.appDefaults.mailjet.key || ''],
        secret: [environment.appDefaults.mailjet.secret || ''],
      }),
      permissions: [[], [Validators.required]],
      categories: [[], [Validators.required]],
      roles: [[], [Validators.required]],
      slackWebHookUrl: environment.appDefaults.slackWebHookUrl || '',
      uppy: this.fb.group({
        companionUrl: environment.appDefaults.uppy.companionUrl,
        facebook: environment.appDefaults.uppy.facebook,
        instagram: environment.appDefaults.uppy.instagram,
        googleDrive: environment.appDefaults.uppy.googleDrive,
        oneDrive: environment.appDefaults.uppy.oneDrive,
        zoom: environment.appDefaults.uppy.zoom,
        dropbox: environment.appDefaults.uppy.dropbox,
        url: environment.appDefaults.uppy.url,
        unsplash: environment.appDefaults.uppy.unsplash
      })
    });

    this.communities = environment.appDefaults.communities;
    this.permissions = environment.appDefaults.permissions;
    this.categories = environment.appDefaults.categories;
    this.roles = environment.appDefaults.roles;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  async onSubmit(): Promise<boolean> {

    this.form.patchValue({ communities: this.communities });
    this.form.patchValue({ permissions: this.permissions });
    this.form.patchValue({ categories: this.categories });
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

  add(event: MatChipInputEvent, type: 'roles' | 'permissions' | 'communities' | 'categories'): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {

      const newItem =
        type === 'roles' ? { title: value, assignedPermissions: [], isCoreRole: false }
          : type === 'categories' ? { title: value, isCoreCategory: false }
            : type === 'permissions' ? { displayName: value, isCorePermission: false }
              : value;

      this[type].push(newItem as any);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(item: Role | Permission | Category | string, type: 'roles' | 'permissions' | 'communities' | 'categories'): void {

    const index =
      type === 'roles' ? this.roles.indexOf(item as Role)
        : type === 'categories' ? this.categories.indexOf(item as Category)
          : type === 'permissions' ? this.permissions.indexOf(item as Permission)
            : this.communities.indexOf(item as string);

    if (index >= 0) {
      this[type].splice(index, 1);
    }
  }

}
