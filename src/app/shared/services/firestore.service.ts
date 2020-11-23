import { DatePipe, FormatWidth, getLocaleDateFormat } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import {
  Action, AngularFirestore, AngularFirestoreCollection,
  AngularFirestoreDocument, DocumentChangeAction, DocumentSnapshot
} from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import algoliasearch from 'algoliasearch';
import { ChartData } from 'chart.js';
import { from, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from '../../views/pages/auth/auth.service';
import { Modification } from '../_interfaces/modification.interface';
import { NotificationItem } from '../_interfaces/notification.interface';
import { Publication } from '../_interfaces/publication.interface';
import { Member } from './../../modules/member/_interfaces/member.interface';
import { Player } from './../../modules/player/_interfaces/player.interface';
import { Senior } from './../../modules/senior/_interfaces/senior.interface';
import { User } from './../../modules/user/_interfaces/user.interface';
import { Config } from './../_interfaces/config.interface';
import { Creation } from './../_interfaces/creation.interface';
import { LayoutUtilsService, MessageType } from './layout-utils.service';
import { NotificationService } from './notification.service';

export type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
export type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  searchClient: any;
  shortDateFormat: string;

  chartColors = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba'];

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string
  ) {
    if (!this.searchClient) {
      this.initApp();
    }
    this.shortDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);
  }

  async initApp() {
    const config = await this.afs.doc(`config/1`).valueChanges().pipe(take(1)).toPromise() as Config;
    if (config.algolia) {
      this.searchClient = algoliasearch(config.algolia.id, config.algolia.key);
    }
  }

  getStatistics(type: 'player' | 'senior' | 'member'): Observable<ChartData> {
    return this.afs.doc(`statistics/${type}-statistics`).valueChanges().pipe(
      map((stats: any) => {

        const chartData: ChartData = {};
        chartData.labels = [`statistics.${type}Title`];

        chartData.datasets = Object.entries(stats).map((s: any) => {
          const backgroundColor = this.chartColors[Math.floor(Math.random() * this.chartColors.length)];
          this.chartColors.splice(this.chartColors.indexOf(backgroundColor), 1);
          return { label: s[0], backgroundColor, data: [s[1]] };
        });
        return chartData;
      })
    );
  }


  public getViewValue(type:
    'players' | 'seniors' | 'members' | 'categories' |
    'matches' | 'locations' | 'articles' | 'teams' | 'users',
    item: any): string {
    let returnString: string;
    switch (type) {
      case 'players':
      case 'members':
      case 'seniors':
        const birthday = item.birthDate ? new DatePipe(this.locale).transform(item.birthDate, this.shortDateFormat) : '';
        returnString = `${item.firstName} ${item.lastName} ${birthday}`;
        break;
      default:
        returnString = item.title;
        break;
    }
    return returnString;
  }

  public getAutocompleteItems(type:
    'players' | 'seniors' | 'members' | 'categories' |
    'matches' | 'locations' | 'articles' | 'teams' | 'users',
    text: string): Observable<any> {
    if (!this.searchClient) {
      this.notificationService.showNotification(
        'Algolia wurde noch nicht konfiguriert! Bitte wechsele zu den Einstellungen',
        'danger'
      );
      return of(null);
    }
    if (!!!text) {
      return of(null);
    }
    const search = this.searchClient.search([{
      indexName: `${type}`,
      query: text
    }]);
    return from(search).pipe(
      catchError(e => {
        this.notificationService.showNotification(e.message, 'danger');
        return of(null);
      }),
      map((result: any) => {
        return result && result.results ? result.results[0].hits : []
      }),
      map((items: any) => {
        return items.map((item: any) => {
          return {
            viewValue: this.getViewValue(type, item),
            value: item.objectID
          };
        });
      })
    );
  }

  col<T>(ref: CollectionPredicate<T>, queryFn?: any): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc<T>(ref).snapshotChanges().pipe(
      map((doc: Action<DocumentSnapshot<T>>) => doc.payload.data() as T)
    );
  }

  col$<T>(ref: CollectionPredicate<T>, queryFn?: any): Observable<T[]> {
    return this.col<T>(ref, queryFn).snapshotChanges().pipe(
      map((docs: DocumentChangeAction<T>[]) => docs.map(a => a.payload.doc.data()) as T[])
    );
  }

  async add<T>(data: any, type: string, createWithGivenId?: boolean): Promise<string> {
    const id = createWithGivenId ? data.id : this.afs.createId();
    await this.doc(`${type}/${id}`).set({ ...data, id, modification: [] });
    return id;
  }

  async update<T>(ref: DocPredicate<T>, data: any): Promise<string> {
    const mod: Modification = {
      at: new Date().valueOf(),
      by: this.authService.authUserId,
      changes: ['ToDo']
    };
    data.modification ? data.modification.push(mod) : data.modification = [mod];
    await this.doc(ref).update(data);
    return data.id;
  }

  delete<T>(ref: DocPredicate<T>): Promise<void> {
    return this.doc(ref).delete();
  }

  removeItem<T>(type: string, item: any, link: string, redirectTo?: string) {
    const notifyCat = `notifications.${type}`;
    const notificationItem: NotificationItem = {
      id: item.id,
      title: item.title,
      type,
      link
    };

    const title = `modal.delete.${item.title}.title`;
    const description = `modal.delete.${type}.description`;
    const waitDescription = `modal.delete.${type}.waitDescription`;
    const deleteMessage = `modal.delete.${type}.success`;

    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDescription);
    dialogRef.afterClosed().subscribe((res: any) => {
      if (!res) {
        return;
      }
      this.delete(this.doc(`${type}/${item.id}`))
        .then(() => {
          this.layoutUtilsService.showActionNotification(deleteMessage, 'success', MessageType.Delete);
          this.notificationService.createNotification(notificationItem, `${notifyCat}.deleteSuccess`, 'success', 'fas fa-check');
        })
        .catch((error) => {
          notificationItem.error = error.message;
          this.notificationService.showNotification(`${notifyCat}.deleteError`, 'danger');

          this.notificationService.createNotification(
            notificationItem,
            `${notifyCat}.deleteError`,
            'danger',
            'fas fa-exclamation-triangle',
            true
          );
        });
      if (redirectTo) {
        return this.router.navigate([redirectTo]);
      }
    });
  }

  initModificationFormArray(): FormArray {
    return this.fb.array([]);
  }

  getModification(item: any, data?: { by: string, change: string }) {
    if (!item.modification) {
      return [{
        at: new Date().valueOf(),
        by: data ? data.by : null,
        changes: data ? data.change : null
      }];
    }
    return item.modification;
  }

  initCreationFormGroup(): FormGroup {
    return this.fb.group({
      by: null,
      at: new Date() as any,
      user: null
    });
  }

  initMetaFormGroup(): FormGroup {
    const fields = this.fb.group({
      link: null,
      description: null,
      publish: false,
      isPublished: false,
      mode: 'link',
      imageURL: null
    });
    return this.fb.group({
      main: fields,
      facebook: fields,
      twitter: fields,
      instagram: fields
    });
  }

  async setCreation(creation: Creation): Promise<Creation> {
    let user = {} as any;
    const at = creation.at ? creation.at.valueOf() : new Date().valueOf();
    const by = creation.by ? creation.by : this.authService.authUserId;
    if (!by.includes('Parser')) {
      const userDoc = await this.doc<User>(`users/${by}`).valueChanges().pipe(take(1)).toPromise() || null;
      user = {
        displayName: this.getUserTitle(userDoc),
        assignedRoles: userDoc?.assignedRoles,
        photoUrl: userDoc?.photoUrl
      };
    }
    return { at, by, user };
  }

  getCreation(item: any, author?: User): Creation {

    if (!item.creation) {
      return {
        at: new Date() as any,
        by: author?.id,
        user: {
          assignedRoles: author?.assignedRoles || [],
          displayName: this.getUserTitle(author || null),
          photoUrl: author?.photoUrl || '',
        }
      };
    }
    // console.log(item.creation);
    const user = item.creation.by && !item.creation.by.includes('Parser')
      ? { assignedRoles: author?.assignedRoles, displayName: this.getUserTitle(author || null), photoUrl: author?.photoUrl }
      : item.creation.user;

    return {
      at: new Date(item.creation.at) as any || new Date(),
      by: (item.creation.by ? item.creation.by : user) || author?.id,
      user: item.creation.user || user
    };
  }

  getMeta(item: any): any {
    if (!item.meta) {
      return { link: '', publish: false, isPublished: false, mode: 'link' };
    }
    return item.meta;
  }

  initPublicationFormGroup(): FormGroup {
    return this.fb.group({
      at: new Date() as any,
      by: null,
      status: 0,
      user: null
    });
  }

  getPublication(item: any, user?: User): Publication {
    if (!item.publication) {
      return {};
    }
    return {
      at: item.publication.at ? new Date(item.publication.at) as any : null,
      by: item.publication.by || null,
      user: item.publication.user || null,
      status: item.publication.status || 0,
    };
  }

  getPublicationStatus(publication: Publication): number {
    let status: number;
    if ('status' in publication && Number.isInteger(publication.status)) {
      status = publication.status || 0;
    } else {
      status = publication.by === '0' ? 0 : 1;
    }
    return status;
  }

  async setPublication(publication: Publication): Promise<Publication> {
    if (publication.by === '0') {
      return { at: 0, by: undefined, user: undefined, status: 0 };
    }

    if (publication?.by && publication.by.indexOf('Parser') > -1) {
      return {
        at: publication.at ? publication.at.valueOf() : undefined,
        by: publication.by,
        status: this.getPublicationStatus(publication)
      };
    }

    const user = await this.doc<User>(`users/${publication.by}`).valueChanges().pipe(take(1)).toPromise();
    return {
      at: publication.at ? publication.at.valueOf() : undefined,
      by: publication.by,
      user: {
        displayName: this.getUserTitle(user as any),
        assignedRoles: user?.assignedRoles || [],
        photoUrl: user?.photoUrl || ''
      },
      status: this.getPublicationStatus(publication)
    };
  }

  getUserTitle(user: User | Player | Member | Senior | null): string {
    if (!user) {
      return 'Anonymous';
    }

    return user.displayName
      ? user.displayName
      : user.title
        ? user.title
        : user.firstName || user.lastName
          ? `${user.lastName} ${user.firstName}`
          : ('email' in user)
            ? user.email : 'Anonymous';
  }

  async save(item: any, type: string, link?: string, createNotification: boolean = true, createWithGivenId?: boolean): Promise<string> {

    if (item.creation) {
      item.creation = { ...item.creation, at: item.creation.at.valueOf() };
    }
    if (item.publication) {
      item.publication = { ...item.publication, at: item.publication.at.valueOf() };
    }
    const notifyCat = `notifications.${type}`;
    const notificationItem: NotificationItem = {
      id: item.id,
      title: item.title || '',
      link: link || type,
      type
    };

    try {

      const action: Promise<string> = item.id && !createWithGivenId
        ? this.update(`${type}/${item.id}`, item)
        : this.add(item, type, createWithGivenId);

      const notificationSuccess = item.id ? `${notifyCat}.updateSuccess` : `${notifyCat}.createSuccess`;

      const newItemId = await action;
      if (!item.id) {
        notificationItem.id = newItemId;
      }

      const id = item.id || newItemId;
      this.notificationService.showNotification(notificationSuccess, 'success');

      if (createNotification) {
        this.notificationService.createNotification(notificationItem, notificationSuccess, 'success', 'fas fa-check');
      }
      return id;
    } catch (error) {
      console.log(item);
      console.log(error.message);
      notificationItem.error = error.message;
      const notificationError = item.id ? `${notifyCat}.updateError` : `${notifyCat}.createError`;
      this.notificationService.showNotification(notificationError, 'danger');
      this.notificationService.createNotification(notificationItem, notificationError, 'danger', 'fas fa-exclamation-triangle', true);
      return error.message;
    }
  }

  /* async getMultipleDocs(collectionTitle: string, entries: string[]): Promise<any> {
    if (!entries || entries.length === 0) {
      return [];
    }
    const promises: Promise<any>[] = [];
    entries.forEach(entry => promises.push(this.doc(`${collectionTitle}/${entry}`).valueChanges().pipe(take(1)).toPromise()));
    return Promise.all(promises);
  }

  async assignItemToItems(data: any, ids: string[], type: string): Promise<any[]> {
    const promises = ids.map(async itemId => this.update(this.doc(`${type}/${itemId}`), data));
    return Promise.all(promises);
  } */

  cleanObject<T>(entity: any): any {
    Object.entries(entity).forEach(([k, v]) => {
      if (!entity.hasOwnProperty(k) || entity[k] === null) {
        delete entity[k];
      }
    });
    return entity;
  }

}
