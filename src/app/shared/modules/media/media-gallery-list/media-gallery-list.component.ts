import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { LayoutUtilsService } from './../../../services/layout-utils.service';
import { MediaGallery } from './../../../_interfaces/media-gallery.interface';

@Component({

  selector: 'app-media-gallery-list',
  templateUrl: './media-gallery-list.component.html',
  styleUrls: ['./media-gallery-list.component.scss']
})
export class MediaGalleryListComponent implements OnInit {

  // @Input() edit = false;
  @Input() mode!: 'view' | 'select' | 'edit' | 'remove' | 'remove-with-default';
  @Input() public set galleries(value: any) {
    this.galleries$.next(value);
  }

  @Output() galleriesChanged: EventEmitter<string> = new EventEmitter<string>();
  galleries$: BehaviorSubject<MediaGallery> = new BehaviorSubject<MediaGallery>({});

  constructor(
    private layoutUtilsService: LayoutUtilsService
  ) { }

  ngOnInit() {
  }

  addGallery() {
    const title = `Galerie hinzufügen`;
    const description = `modal.media.gallery.description`;
    const placeholder = `modal.media.gallery.placeholder`;
    const dialogRef = this.layoutUtilsService.addGallery(title, description, placeholder);
    dialogRef.afterClosed().pipe(take(1)).subscribe((a) => this.checkGallery(a));
  }

  checkGallery(gallery: any) {
    if (gallery && gallery.title) {
      const currentValue: any = this.galleries$.value;
      currentValue[gallery.title] = { title: gallery.title };
      this.galleries$.next(currentValue);
    }
  }

  deleteGallery(key: any) {
    const currentValue: any = this.galleries$.value;
    delete currentValue[key];
    this.galleriesChanged.emit(currentValue);
  }

  updateGallery(key: any, gallery: any) {
    const currentValue: any = this.galleries$.value;
    currentValue[key] = gallery;
    this.galleriesChanged.emit(currentValue);
  }

  trackByGallery(index: number, gallery: any) {
    return gallery.key;
  }

}
