import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission } from '../permission/_interfaces/permission.interface';
import { Config } from './../../shared/_interfaces/config.interface';
import { Article } from './../article/_interfaces/article.interface';
import { Role } from './../role/_interfaces/role.interface';
import { Application } from './_interfaces/application.interface';
import { Calendar } from './_interfaces/calendar.interface';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(
    private afs: AngularFirestore
  ) {
  }

  public getCurrentApplication(): Observable<Application | undefined> {
    return this.afs.doc<Application>('applications/currentApplication')?.valueChanges(); // .pipe(take(1))
  }

  public getConfig(): Observable<Config | undefined> {
    return this.afs.doc<Config>(`config/1`).valueChanges();
  }

  public getRolesForSetup(): Observable<Role[] | undefined> {
    return this.afs.collection<Role>('roles').valueChanges();
  }

  public getPermissionsForSetup(): Observable<Permission[] | undefined> {
    return this.afs.collection<Permission>('permissions', (ref: Query) => ref.orderBy('displayName')).valueChanges();
  }

  public getCalendars(): Observable<Calendar[] | undefined> {
    return this.getCurrentApplication().pipe(
      map(application => application?.assignedCalendars?.filter(calendar => calendar.isActive))
    );
  }

  public getWeekdays(): number[] {
    const weekdays = [];
    for (let i = 0; i < 7; i++) {
      weekdays.push(i);
    }
    return weekdays;
  }

  public getRandomColour(defaults?: string[]): string {
    return defaults
      ? defaults[Math.floor(Math.random() * defaults.length)]
      : Math.floor(Math.random() * 16777215).toString(16);
  }

  public getArticle(id: string): Observable<Article | undefined> {
    return this.afs.doc<Article>(`articles/${id}`).valueChanges();
  }

  public getFooterArticles(): Observable<Article[]> {
    return this.afs.collection<Article>(`articles`, (ref: Query) => {
      ref = ref.where('displayInBackendFooter', '==', true);
      ref = ref.where('publication.at', '<=', new Date().valueOf());
      return ref;
    }).valueChanges();
  }

  public hexToRgb(hex: string): number[] {
    const value = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
      .substring(1)
      .match(/.{2}/g)
      ?.map(x => parseInt(x, 16));

    return value || [255, 21, 0, 1];
  }

}
