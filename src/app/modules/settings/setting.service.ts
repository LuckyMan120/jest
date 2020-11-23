import { Injectable } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Category } from '../category/_interfaces/category.interface';
import { Config } from './../../shared/_interfaces/config.interface';
import { Application } from './_interfaces/application.interface';
import { Calendar } from './_interfaces/calendar.interface';
import { Link } from './_interfaces/link.interface';
import { MailList } from './_interfaces/mail-list.interface';


@Injectable()
export class SettingService {

  title = { min: 3, max: 50 };
  subTitle = { min: 3, max: 100 };

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) {
  }

  public getFormFields(): FormGroup {
    return this.fb.group({
      id: null,
      downtime: this.fb.group({
        isEnabled: false,
        message: '',
      }),
      site: this.fb.group({
        title: ['', [Validators.required, Validators.minLength(this.title.min), Validators.maxLength(this.title.max)]],
        subTitle: ['', [Validators.required, Validators.minLength(this.subTitle.min), Validators.maxLength(this.subTitle.max)]],
        email: ['', [Validators.email, Validators.required, Validators.email]],
        description: '',
        assignedKeywords: null,
        author: null
      }),
      registration: this.fb.group({
        isEnabled: true,
        defaultRole: null
      }),
      modification: this.fb.array([]),
      assignedCalendars: this.fb.array([]),
      mailing: this.fb.array([]),
      assignedLinks: this.fb.array([])
    });
  }

  public initLink(link: Link | undefined): FormGroup {
    return this.fb.group({
      link: [link ? link.link : '', [Validators.required, Validators.minLength(15)]],
      title: [link ? link.title : '', [Validators.required, Validators.minLength(5)]],
      isActive: link ? link.isActive : true,
      isMailLink: link ? link.isMailLink : false,
      target: link ? link.target : '_blank',
      displayInFooter: link ? link.displayInFooter : false,
      displayInHeader: link ? link.displayInHeader : false,
      icon: link ? link.icon : null,
      assignedCategoryId: link ? link.assignedCategoryId : null
    });
  }

  public initCalendar(calendar: Calendar | undefined): FormGroup {
    return this.fb.group({
      calendarId: [calendar ? calendar.calendarId : '', [Validators.required, Validators.minLength(15)]],
      title: [calendar ? calendar.title : '', [Validators.required, Validators.minLength(5)]],
      isActive: calendar ? calendar.isActive : true,
      color: calendar ? calendar.color : null,
      manualAddingAllowed: calendar ? calendar.manualAddingAllowed : true
    });
  }

  public initMailList(mailList: MailList | undefined): FormGroup {
    return this.fb.group({
      // eslint-disable-next-line
      assignedCategoryId: [mailList ? mailList.assignedCategoryId : '', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      emails: [mailList ? mailList.emails : []],
      isActive: mailList ? mailList.isActive : true
    });
  }

  public getCategoriesByTitle(title: string): Observable<Category[]> {
    return this.firestoreService.col<Category>(`categories`, (ref: CollectionReference) => ref.where('title', '==', title)).valueChanges();
  }

  public save(application: Application): Promise<string> {
    application.title = application.site.title;
    return this.firestoreService.save(application, 'applications', 'application');
  }

  public saveConfig(config: Config): Promise<string> {
    config.fussball.startDate = config.fussball.startDate.valueOf();
    return this.firestoreService.save(config, 'config', 'config');
  }

  public getConfigForm(): FormGroup {

    const startDate = new Date();
    startDate.setMonth(6);
    startDate.setDate(1);

    return this.fb.group({
      algolia: this.fb.group({
        id: null,
        key: null
      }),
      communities: [],
      dfbnet: this.fb.group({
        username: null,
        password: null
      }),
      fussball: this.fb.group({
        clubId: ['', [Validators.required]],
        endDateOffset: [12, [Validators.required, Validators.min(1), Validators.max(12)]],
        startDate,
      }),
      googleDriveMemberSheet: '',
      id: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      mailjet: this.fb.group({
        key: null,
        secret: null
      }),
      slackWebHookUrl: ''
    });
  }

}
