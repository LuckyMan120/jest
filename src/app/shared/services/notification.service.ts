import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../views/pages/auth/auth.service';
import { Notification, NotificationItem } from '../_interfaces/notification.interface';
import { LayoutUtilsService } from './layout-utils.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private afs: AngularFirestore,
    private authService: AuthService
  ) { }

  showNotification(message: string, type: string): void {
    this.layoutUtilsService.showActionNotification(message, type, 5000, 2500, true);
  }

  createNotification(
    notificationItem: NotificationItem,
    reason: string,
    severity: 'info' | 'success' | 'warning' | 'danger',
    icon?: string,
    forReview: boolean = false
  ): Promise<void> {
    const notification: Notification = {
      id: this.afs.createId(),
      notificationItem,
      icon,
      reason,
      severity,
      forReview,
      isReviewed: severity === 'warning' || severity === 'danger' ? true : false,
      creationDate: new Date().valueOf(),
      assignedUserId: this.authService.authUserId,
      assignedUserName: this.authService.authUserName
    };
    return this.afs.collection('notifications').doc(notification.id).set(notification);
  }

  removeNotification(notification: Notification): Promise<void> {
    return this.afs.collection('notifications').doc(notification.id).delete();
  }

  getNotifications(startDate?: number): Observable<Notification[]> {
    console.log('notifications', startDate);
    return this.afs.collection<Notification>('notifications', (ref: Query) => {
      ref = startDate ? ref.where('creationDate', '>=', startDate) : ref;
      return ref;
    }).valueChanges().pipe(
      tap(console.log),
      tap((notifications: Notification[]) => notifications.map(notification => ({
        ...notification,
        creationDate: new Date(notification.creationDate)
      }))));
  }

}
