import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MediaService } from '../media.service';
import { Category } from './../../../../modules/category/_interfaces/category.interface';
import { FirestoreService } from './../../../services/firestore.service';
import { LayoutUtilsService } from './../../../services/layout-utils.service';
import { MediaItem } from './../../../_interfaces/media-item.interface';

@Component({

  selector: 'app-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.scss']
})
export class MediaItemComponent implements OnInit {

  @Input() public set media(value: MediaItem) {
    this._media = value;
    this.isImage = value.sizes && !this.fileTypeNotImages.includes(value.metadata.fileType);
  }

  public get media() {
    return this._media;
  }

  public get iconSize() {
    return `calc(${this.imageHeight} - 30px)`;
  }

  @Input() categories!: Category[];
  @Input() mode!: 'view' | 'select' | 'edit' | 'remove' | 'remove-with-default';
  @Input() imageHeight = '200px';
  @Input() isDefault = false;

  @Output() deleteMedia: EventEmitter<MediaItem> = new EventEmitter(false);
  @Output() showMedia: EventEmitter<MediaItem> = new EventEmitter(false);

  @Output() setSelect: EventEmitter<MediaItem> = new EventEmitter<MediaItem>();
  @Output() deSelect: EventEmitter<MediaItem> = new EventEmitter<MediaItem>();
  @Output() remove: EventEmitter<MediaItem> = new EventEmitter<MediaItem>();
  @Output() default: EventEmitter<MediaItem> = new EventEmitter<MediaItem>();

  savedTitle!: string | null;
  form!: FormGroup;
  hasFormErrors = false;
  selected = false;
  isImage!: boolean;
  fileTypeNotImages = ['image/svg+xml'];

  private readonly minLength = 10;
  private readonly maxLength = 100;
  private _media!: MediaItem;

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private firestoreService: FirestoreService,
    private mediaService: MediaService
  ) {
  }

  ngOnInit() {
    this.form = this.mediaService.getFormFields(this.minLength, this.maxLength);
    this.form.patchValue(this.media);
    this.savedTitle = this.media.metadata ? this.media.metadata.fileName : null;
  }

  onSelect() {
    this.setSelect.next(this.media);
    this.selected = true;
  }

  onRemove() {
    this.deSelect.next(this.media);
    this.selected = false;
  }

  onDefault() {
    this.default.next(this.media);
  }

  showInfo() {
    const dialogRef = this.layoutUtilsService.showMediaInfo({ media: this.media, categories: this.categories });
    dialogRef.afterClosed().subscribe((res: { mediaItem: MediaItem, action: string }) => {
      if (!res) {
        return;
      }
      if (res.action === 'delete') {
        this.delete(res.mediaItem);
      } else {
        this.firestoreService.save(res.mediaItem, 'medias');
      }
    });
  }

  delete(mediaItem?: MediaItem): void {
    const item = mediaItem ? mediaItem : this.media;
    item.title = item.metadata.fileName;
    return this.firestoreService.removeItem('medias', item, 'media');
  }

  async onSubmit() {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    await this.firestoreService.save(this.form.value, 'medias', 'media');
    return this.savedTitle = this.form.get('fileTitle')?.value;
  }

}
