import { BaseInterface } from './base.interface';

export interface Notification {
  id: string;
  reason: string;
  notificationItem: NotificationItem;

  severity: 'info' | 'success' | 'warning' | 'danger';
  icon?: string;
  forReview?: boolean;

  creationDate: number | Date;

  assignedUserId: string;
  assignedUserName?: string;
  isReviewed: boolean;
}

export interface NotificationItem extends BaseInterface {
  link?: string;
  type: string;
  title?: string;
  error?: string;
}
