import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/_interfaces/category.interface';
import { ApplicationService } from '../application.service';
import { SettingService } from '../setting.service';
import { Application } from '../_interfaces/application.interface';
import { Calendar } from '../_interfaces/calendar.interface';
import { Link } from '../_interfaces/link.interface';
import { MailList } from '../_interfaces/mail-list.interface';
import { environment } from './../../../../environments/environment';
import { Role } from './../../role/_interfaces/role.interface';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  emailList: string[] = [];

  application$!: Observable<Application | undefined>;
  roles$!: Observable<Role[]>;
  categories$!: Observable<Category[]>;
  mailListCategories$!: Observable<Category[]>;
  savedApplication!: Application;
  selectedTab = 0;
  hasFormErrors = false;
  form!: FormGroup;
  targets = ['_blank', '_self'];
  colors!: string[];

  constructor(
    public settingService: SettingService,
    private applicationService: ApplicationService,
    private firestoreService: FirestoreService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit(): void {
    this.form = this.settingService.getFormFields();

    this.application$ = this.applicationService.getCurrentApplication().pipe(
      tap((application: Application | undefined) => {
        if (application) {
          application?.assignedCalendars?.forEach(calendar => this.addCalendar(calendar));
          application?.mailing?.forEach(mailList => this.addMailList(mailList));
          application?.assignedLinks?.forEach(link => this.addLink(link));

          this.form.patchValue(application);
          this.savedApplication = Object.freeze(Object.assign({}, application));
        }
      })
    );

    this.colors = environment.appDefaults.colors;
    this.categories$ = this.categoryService.getCategoryListByParentCategoryTitle('Links');
    this.mailListCategories$ = this.categoryService.getCategoryListByParentCategoryTitle('E-Mail Verteiler');
    this.roles$ = this.firestoreService.col<Role>(`roles`).valueChanges();
  }

  public get email() { return this.form.get('site.email'); }

  public get mailingControls() {
    return (this.form.get('mailing') as any).controls;
  }

  public get assignedLinksControls() {
    return (this.form.get('assignedLinks') as any).controls;
  }

  public get assignedCalendarControls() {
    return (this.form.get('assignedCalendars') as any).controls;
  }

  addLink(link?: Link | undefined) {
    const control = this.form.get('assignedLinks') as FormArray;
    control.push(this.settingService.initLink(link));
  }

  deleteLink(i: number) {
    const control = this.form.get('assignedLinks') as FormArray;
    control.removeAt(i);
  }

  addCalendar(calendar?: Calendar | undefined) {
    const control = this.form.get('assignedCalendars') as FormArray;
    control.push(this.settingService.initCalendar(calendar));
  }

  deleteCalendar(i: number) {
    const control = this.form.get('assignedCalendars') as FormArray;
    control.removeAt(i);
  }

  addMailList(mailList?: MailList | undefined): void {
    if (mailList && mailList?.emails) {
      this.emailList.push(mailList.emails as any);
    }
    const control = this.form.get('mailing') as FormArray;
    control.push(this.settingService.initMailList(mailList));
  }

  deleteMailList(i: number): void {
    const control = this.form.get('mailing') as FormArray;
    control.removeAt(i);
  }

  onAlertClose(): void {
    this.hasFormErrors = false;
  }

  setFormErrors($event: boolean): void {
    this.hasFormErrors = $event;
  }

  onSubmit() {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }
    this.settingService.save(this.form.value as Application);
  }

  reset() {
    this.form.patchValue(this.savedApplication);
  }

  remove(item: string, i: number): void {
    const control = (((this.form.get('mailing') as FormArray).controls[i] as FormArray).controls as any).emails as FormControl;
    const index = control.value.indexOf(item);
    if (index >= 0) {
      control.value.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent, i: number): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const control = (((this.form.get('mailing') as FormArray).controls[i] as FormArray).controls as any).emails as FormControl;

      if (!control.value.includes(value)) {
        control.value.push(value);
      }
    }

    if (input) {
      input.value = '';
    }
  }

}
