import { Injectable } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FacebookLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Application } from '../settings/_interfaces/application.interface';
import { FirestoreService } from './../../shared/services/firestore.service';
import { NotificationService } from './../../shared/services/notification.service';
import { MediaItem } from './../../shared/_interfaces/media-item.interface';
import { SocialPosting } from './../../shared/_interfaces/social-posting.interface';
import { Article } from './../article/_interfaces/article.interface';
import { Location } from './../location/_interfaces/location.interface';
import { User } from './../user/_interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class StartService {

  constructor(
    private firestoreService: FirestoreService,
    private fns: AngularFireFunctions,
    private notificationService: NotificationService,
    private authService: SocialAuthService
  ) {
  }

  createPosting(posting: SocialPosting) {
    if (posting.type === 'facebook') {
      return this.getSocialAuthState().pipe( // get Social authstate and ask to sign in if not signed in
        map(socialUser => socialUser.authToken),
        switchMap((token) => this.postToCloudFunction(posting, token))
      );
    } else if (posting.type === 'twitter') {
      return this.postToCloudFunction(posting);
    }
  }

  getCurrentApplication(): Observable<Application | undefined> {
    return this.firestoreService.doc<Application>('applications/currentApplication')?.valueChanges();
  }

  getLatestUsers(limit: number): Observable<User[]> {
    return this.firestoreService.col$<User>(`users`, (ref: any) => {
      ref = ref.orderBy('creationTime', 'desc');
      ref = ref.limit(limit);
      return ref;
    }).pipe(
      map(users => {
        return users.map(user => {
          return {
            id: user.id,
            title: user.firstName || user.lastName
              ? `${user.firstName} ${user.lastName}` : user.displayName
                ? user.displayName : user.email,
            pic: user.photoUrl,
            link: '/users/detail'
          } as any;
        });
      })
    );
  }

  getLatestArticles(limit: number): Observable<Article[]> {
    return this.firestoreService.col$<Article>(`articles`, (ref: any) => {
      ref = ref.orderBy('creation.at', 'desc');
      ref = ref.limit(limit);
      return ref;
    }).pipe(
      map(articles => {
        return articles.map(article => {
          return {
            ...article,
            desc: article.subTitle,
            link: '/articles/detail'
          } as any;
        });
      })
    );
  }

  getLatestArticle(): Observable<Article[]> {
    return this.firestoreService.col$<Article>(`articles`, (ref: any) => {
      ref = ref.orderBy('creation.at', 'desc');
      ref = ref.limit(1);
      return ref;
    });
  }

  getApplicationStats(): Observable<any> {
    return this.firestoreService.doc(`statistics/currentApplication`).valueChanges();
  }

  getLatestFiles(limit: number): Observable<MediaItem[]> {
    return this.firestoreService.col$<MediaItem>('medias', (ref: any) => {
      ref = ref.orderBy('creation.at', 'desc');
      ref = ref.limit(limit);
      return ref;
    }).pipe(
      map(mediaItems => {
        return mediaItems.map(mediaItem => {
          return {
            ...mediaItem,
            title: mediaItem.fileTitle,
            link: '/media-center/dashboard',
            queryParams: {
              dialog: true,
              mediaId: mediaItem.id
            }
          };
        });
      })
    );
  }

  async createGoogleCalendarEvent(data: any): Promise<any> {
    let location;
    if (data.location) {
      const snap = await this.firestoreService.doc(`locations/${data.location}`).get().toPromise() as DocumentSnapshot<Location>;
      location = snap.data()?.title;
    }
    const event = {
      summary: data.summary,
      description: data.description,
      startDate: data.startDate.valueOf(),
      endDate: data.endDate.valueOf(),
      location: location
    };


    const callable = this.fns.httpsCallable('callCreateEvent');
    return callable({ event, data: data.calendarId })
      .toPromise()
      .then((result) => {
        if (result) {
          if (result.error) {
            this.notificationService.showNotification(`notifications.calendarEvents.createError`, 'danger');
          } else {
            this.notificationService.showNotification(`notifications.calendarEvents.createSuccess`, 'success');
          }
        }
      })
      .catch((err) => {
        this.notificationService.showNotification(`notifications.calendarEvents.createError`, 'danger');
        return of(err);
      });
  }

  public callFn(fnName: string, args?: any) {
    const callable = this.fns.httpsCallable(fnName);
    return callable(args ? args : {});
  }


  private getSocialAuthState() {
    return this.authService.authState.pipe(
      take(1),
      switchMap((socialUser) => {
        return socialUser ? of(socialUser) : this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
      })
    );
  }

  private postToCloudFunction(posting: SocialPosting, token?: string) {
    posting.startDate = new Date().valueOf();
    if (posting.mode === 'link') {
      posting.imageURL = undefined;
    } else if (posting.mode === 'photo') {
      posting.link = undefined;
    }
    const data = { ...posting, userAccessToken: token };
    return this.fns.httpsCallable('socialMessage')(data).pipe(
      catchError((err) => {
        this.notificationService.showNotification(`notifications.socialPost.createError`, 'danger');
        return of(null);
      }),
      tap((result) => {
        if (result) {
          if (result.error) {
            console.error(result.error);
            this.notificationService.showNotification(`notifications.socialPost.createError`, 'danger');
          } else {
            this.notificationService.showNotification(`notifications.socialPost.createSuccess`, 'success');
          }
        }
      })
    );
  }


}
