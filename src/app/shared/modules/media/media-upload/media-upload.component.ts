import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { MediaItem } from './../../../../shared/_interfaces/media-item.interface';
import { LayoutUtilsService } from './../../../services/layout-utils.service';

@Component({

  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss']
})
export class MediaUploadComponent {

  @Input() public set media(value: MediaItem) {
    this.media$.next(value);
  }
  @Output() mediaChanged = new EventEmitter();

  public media$ = new BehaviorSubject<MediaItem | undefined>(undefined);

  constructor(
    private layoutService: LayoutUtilsService
  ) { }

  selectMedia() {
    const dialogRef = this.layoutService.showMediaPopup(undefined, false, true);
    dialogRef.afterClosed().pipe(take(1)).subscribe((media) => {
      if (media) {
        this.mediaChanged.emit(media);
      }
    });
  }

  removeMedia() {
    this.mediaChanged.emit(null);
  }
}
