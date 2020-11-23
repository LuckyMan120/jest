import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaItem } from '@shared/_interfaces/media-item.interface';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { LayoutUtilsService } from './../../../services/layout-utils.service';
import { MediaGallery } from './../../../_interfaces/media-gallery.interface';

@Component({

  selector: 'app-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.scss']
})
export class MediaGalleryComponent {

  @Input() mode!: 'view' | 'select' | 'edit' | 'remove' | 'remove-with-default';
  @Input() public set gallery(value: MediaGallery) {
    this._gallery.next(value);
  }
  @Output() deleteGallery: EventEmitter<MediaGallery | undefined> = new EventEmitter<MediaGallery | undefined>();
  @Output() galleryChanged: EventEmitter<MediaGallery | undefined> = new EventEmitter<MediaGallery | undefined>();

  _gallery: BehaviorSubject<MediaGallery> = new BehaviorSubject<MediaGallery>(this.gallery);

  constructor(
    private layoutUtilsService: LayoutUtilsService
  ) { }


  showMediasDialog() {
    const dialogRef = this.layoutUtilsService.showMediaPopup(null, true, this.mode === 'edit' ? true : false);
    dialogRef.afterClosed().pipe(take(1)).subscribe((medias) => {
      if (medias) {
        this.cleanMedias(medias);
        const g = this._gallery.value;
        if (g) {
          g.files = { ...g?.files, ...medias } as MediaItem[];
          this.galleryChanged.emit(g);
        }
      }
    });
  }

  removeFile(media: MediaItem) {
    const g = this._gallery.value;
    delete (g?.files as [])[media.id as any];
    if (g?.default === media.id) {
      delete g.default;
    }
    this.galleryChanged.emit(g);
  }

  defaultFile(media: MediaItem) {
    const g = this._gallery.value;
    if (g) {
      g.default = media.id;
      this.galleryChanged.emit(g);
    }
  }

  trackByMedia(index: number, item: MediaItem) {
    return item.id;
  }

  private cleanMedias(medias: any) {
    const keys = Object.keys(medias);
    for (const key of keys) {
      delete medias[key].creation;
    }
  }

}
