import { Color } from '@angular-material-components/color-picker';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Calendar } from '@application/_interfaces/calendar.interface';
import { MailList } from '@application/_interfaces/mail-list.interface';
import { Category } from '@category/_interfaces/category.interface';
import { Permission } from '@permission/_interfaces/permission.interface';
import { Role } from '@role/_interfaces/role.interface';
import { ErrorResponse } from '@shared/_interfaces/error-response.interface';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { defaults } from './../../../../../../environments/defaults';

@Component({
  selector: 'app-second-step',
  templateUrl: './second-step.component.html',
  styleUrls: ['./second-step.component.scss']
})
export class SecondStepComponent implements OnInit, OnDestroy {

  @ViewChildren(MatSelect) matSelects!: QueryList<MatSelect>;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error$: BehaviorSubject<ErrorResponse | undefined> = new BehaviorSubject<ErrorResponse | undefined>(undefined);

  form!: FormGroup;
  roles$!: Observable<Role[] | undefined>;
  permissions$!: Observable<Permission[] | undefined>;
  rolesToPermissions: any = {};
  sub!: Subscription;

  mailing!: MailList[];
  visibleMailing = true;
  selectableMailing = true;
  removableMailing = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;

  mailListCategories!: Category[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fns: AngularFireFunctions,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      site: this.fb.group({
        assignedKeywords: [defaults.site.keywords || '', [Validators.required]],
        author: [defaults.site.author, [Validators.required]],
        backendUrl: [defaults.site.backendUrl || '', [Validators.required]],
        description: [defaults.site.description || '', [Validators.required]],
        email: [defaults.site.email || '', [Validators.required]],
        frontendUrl: [defaults.site.frontendUrl || '', [Validators.required]],
        subTitle: [defaults.site.subTitle || '', [Validators.required]],
        title: [defaults.site.title || '', [Validators.required]],
      }),
      registration: this.fb.group({
        defaultRole: ['', [Validators.required]],
        isEnabled: true
      }),
      assignedCalendars: this.fb.array([]),
      mailing: this.fb.array([])
    });

    this.roles$ = this.afs.collection<Role>('roles').valueChanges().pipe(
      map((roles: Role[]) => roles && roles?.filter(Boolean).sort((a, b) =>
        (a.title as string) < (b.title as string) ? -1 : (a.title as string) > (b.title as string) ? 1 : 0)
      )
    );

    this.permissions$ = this.afs.collection<Permission>('permissions', (ref: Query) => ref.orderBy('displayName')).valueChanges();
    this.initCalendars(defaults.assignedCalendars);

    this.initMailing(defaults.mailing);
    this.mailing = defaults.mailing;
    this.mailListCategories = defaults.categories.filter(cat => cat.assignedCategoryTitles?.includes('E-Mail Verteiler'));
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  get assignedCalendarControls() {
    return (this.form.get('assignedCalendars') as any).controls;
  }

  get assignedMailingControls() {
    return (this.form.get('mailing') as any).controls;
  }

  toggleAllSelection($event: MatCheckboxChange, i: number) {
    this.matSelects.forEach((matSelect: MatSelect, idx: number) => {
      if (i === idx - 1) {
        matSelect.options.forEach((item: MatOption) => $event.checked ? item.select() : item.deselect());
        matSelect.close();
      }
    });
  }

  initCalendars(calendars: Calendar[]): FormArray {
    const control = this.form.get('assignedCalendars') as FormArray;
    const colors = defaults.colors;

    calendars.map((calendar: Calendar, idx: number) => {
      const color = this.getRandomColor(colors);
      const hexColor = this.hexToRgb(color);
      colors.splice(colors.indexOf(color), 1);

      return control.push(
        this.fb.group({
          calendarId: [calendar.calendarId, [Validators.required, Validators.minLength(15)]],
          title: [calendar.title, [Validators.required, Validators.minLength(5)]],
          isActive: calendar.isActive,
          color: new Color(hexColor[0], hexColor[1], hexColor[2]),
          manualAddingAllowed: calendar.manualAddingAllowed
        })
      );
    });
    return control;
  }

  initMailing(mailLists: MailList[]): FormArray {
    const control = this.form.get('mailing') as FormArray;
    mailLists.map(mailList => control.push(
      this.fb.group({
        isActive: mailList ? mailList.isActive : true,
        emails: [],
        assignedCategoryTitle: mailList ? mailList.assignedCategoryTitle : ''
      })
    ));
    return control;
  }

  async onSubmit(): Promise<boolean | void> {

    this.mailing.map((mailList: MailList, idx: number) => {
      (this.form.get('mailing') as any).controls[idx].controls.emails.setValue(mailList.emails);
    });

    if (this.form.valid) {
      this.isLoading$.next(true);

      const result = await this.fns.httpsCallable('callSetupStep2')({
        form: this.form.value,
        rolesToPermissions: this.rolesToPermissions
      }).toPromise();
      this.isLoading$.next(false);
      if (result.success) {
        return this.router.navigate(['/auth/register']);
      } else {
        return this.error$.next(result);
      }
    }
  }

  changeRolePermissions($event: MatSelectChange, role: Role) {
    this.rolesToPermissions[role.id as string] = {
      roleId: role.id,
      assignedPermissions: $event.value
    };
  }

  add(event: MatChipInputEvent, i: number): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim() && !this.mailing[i].emails.includes(value)) {
      this.mailing[i].emails.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(item: string, i: number): void {
    const index = this.mailing[i].emails.indexOf(item);
    if (index >= 0) {
      this.mailing[i].emails.splice(index, 1);
    }
  }

  getRandomColor(defaults?: string[]): string {
    return defaults
      ? defaults[Math.floor(Math.random() * defaults.length)]
      : Math.floor(Math.random() * 16777215).toString(16);
  }

  hexToRgb(hex: string): number[] {
    const value = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
      .substring(1)
      .match(/.{2}/g)
      ?.map(x => parseInt(x, 16));

    return value || [255, 21, 0, 1];
  }

}
