import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MediaService } from '../media.service';

@Component({
  selector: 'media-selector',
  templateUrl: './media-selector.component.html',
  styleUrls: ['./media-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MediaSelectorComponent implements OnInit {
  @Input() public set gallery(value: { default?: any; }) {
    if (value) {
      this.selectedImages = Object.keys(value);
      this._default = value.default;
    }
  }
  @Input() tags: any;
  @Input() size: any;
  @Input() public set canEdit(value) {
    this._canEdit = value;
    this.classes.canEdit = value;
  }
  public get canEdit(): boolean {
    return this._canEdit;
  }

  @Output() selectClicked = new EventEmitter<any>();
  @Output() unSelectClicked = new EventEmitter<any>();
  @Output() defaultClicked = new EventEmitter<any>();

  public classes: any = {};
  public medias$!: Observable<any[]>;
  public selectedImages: any = [];
  private _default!: string | null;
  private _canEdit = false;
  private refresh = new BehaviorSubject<void>(undefined);

  constructor(private mediaService: MediaService) {
  }

  ngOnInit() {
    this.medias$ = this.refresh.pipe(
      switchMap(() => this.mediaService.getMedias(this.tags).pipe(
        map(list => list.map(element => new Object({
          src: element.sizes[this.size],
          key: element.id,
          data: element,
          selected: this.isImagePresentInGallery(element.id),
          classes: { selected: this.isImagePresentInGallery(element.id) },
          default: this.isDefault(element.id)
        })))
      ))
    );
  }


  select(img: any) {
    this.selectedImages.push(img.key);
    this.refresh.next(undefined);
    this.selectClicked.next(img);
  }


  unSelect(img: any) {
    if (this._default === img.key) { this._default = null; }
    const index = this.selectedImages.indexOf(img.key, 0);
    if (index > -1) {
      this.selectedImages.splice(index, 1);
    }
    this.refresh.next(undefined);
    this.unSelectClicked.next(img);
  }

  default(img: any) {
    this._default = img.key;
    this.refresh.next(undefined);
    this.defaultClicked.emit(img);
  }

  trackByFn(index: number, item: any): number { return item.key; }

  private isDefault(id: string) {
    return this._default === id;
  }

  private isImagePresentInGallery(id: string) {
    return this.selectedImages.includes(id);
  }

}
