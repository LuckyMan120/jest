import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { MediaPickerComponent } from '../modules/media/media-picker/media-picker.component';
import { EventFormComponent } from './../../modules/calendar/event-form/event-form.component';
import { EventInfoComponent } from './../../modules/calendar/event-info/event-info.component';
import { Category } from './../../modules/category/_interfaces/category.interface';
import { ActionNotificationComponent } from './../modules/crud/action-notification/action-notification.component';
import { DeleteEntityDialogComponent } from './../modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { AddGalleryComponent } from './../modules/media/add-gallery/add-gallery.component';
import { MediaInfoComponent } from './../modules/media/media-info/media-info.component';
import { MediaItem } from './../_interfaces/media-item.interface';

export enum MessageType {
  Create,
  Read,
  Update,
  Delete,
  Canceled
}

@Injectable({ providedIn: 'root' })
export class LayoutUtilsService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  showActionNotification(
    message: string,
    color: string,
    type: MessageType = MessageType.Create,
    duration: number = 10000,
    showCloseButton: boolean = true,
    showUndoButton: boolean = true,
    undoButtonDuration: number = 3000,
    verticalPosition: 'top' | 'bottom' = 'bottom'
  ) {
    const data = {
      message,
      color,
      snackBar: this.snackBar,
      showCloseButton,
      showUndoButton,
      undoButtonDuration,
      verticalPosition,
      type,
      action: 'Undo'
    };
    return this.snackBar.openFromComponent(ActionNotificationComponent, { duration, data, verticalPosition });
  }

  deleteElement(title: string = '', description: string = '', waitDescription: string = '') {
    return this.dialog.open(DeleteEntityDialogComponent, { data: { title, description, waitDescription }, width: '440px' });
  }

  /* changeElements(items: any[], fields: {}, title: string = '', description: string = '', waitDescription: string = '') {
    return this.dialog.open(EditEntityDialogComponent, { data: { items, fields, title, description, waitDescription }, width: '80vw' });
  } */

  showEventForm(data: { event: any }) {
    return this.dialog.open(EventFormComponent, { data, minWidth: '70vw', maxWidth: '70vw', maxHeight: '80vh', hasBackdrop: true });
  }

  showEventInfo(data: { event: any }) {
    return this.dialog.open(EventInfoComponent, { data, minWidth: '90vw', maxWidth: '95vw', maxHeight: '80vh', hasBackdrop: false });
  }

  showMediaStatistics(data: any) {
    // return this.dialog.open(MediaStatisticsComponent, { data, minWidth: '90vw', maxWidth: '95vw', hasBackdrop: false });
  }

  addGallery(title: string, description: string, waitDescription: string) {
    return this.dialog.open(AddGalleryComponent, { data: { title, description, waitDescription }, width: '80vw', hasBackdrop: false });
  }

  showMediaInfo(data: { media: MediaItem, categories: Category[] }) {
    return this.dialog.open(MediaInfoComponent, { data, minWidth: '90vw', maxWidth: '95vw', maxHeight: '80vh', hasBackdrop: false });
  }

  showMediaPopup(filter: any = null, multiple: boolean = false, allowUpload = false) {
    return this.dialog.open(MediaPickerComponent, { data: { filter, multiple, allowUpload }, width: '80vw', height: '80vh' });
  }

  showPlayerStatistics(data: Observable<any>) {
    // return this.dialog.open(PlayerStatisticsComponent, { data, width: '80vw', height: '70vh', hasBackdrop: false });
  }

  showMemberStatistics(data: { memberList: Observable<any>, type: string }) {
    // return this.dialog.open(MemberStatisticsComponent, { data, width: '80vw', height: '70vh', hasBackdrop: false });
  }

}
