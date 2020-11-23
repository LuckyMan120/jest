import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { LayoutUtilsService } from './../../../shared/services/layout-utils.service';
import { MediaGallery } from './../../../shared/_interfaces/media-gallery.interface';

@Component({

  selector: 'app-gallery-form',
  templateUrl: './gallery-form.component.html',
  styleUrls: ['./gallery-form.component.scss']
})
export class GalleryFormComponent implements OnInit {

  gallery$: BehaviorSubject<MediaGallery | undefined> = new BehaviorSubject<MediaGallery | undefined>(undefined);

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit(): void {
  }

  addGallery() {
    const title = `Galerie erstelen`;
    const description = `modal.media.gallery.addDescription`;
    const placeholder = `modal.media.gallery.placeholder`;
    const dialogRef = this.layoutUtilsService.addGallery(title, description, placeholder);
    dialogRef.afterClosed().pipe(take(1)).subscribe((a) => this.checkGallery(a));
  }

  checkGallery(mediaGallery: MediaGallery) {
    if (mediaGallery && mediaGallery.title) {
      this.gallery$.next(mediaGallery);
    }
  }

  saveGallery(mediaGallery: MediaGallery) {
    console.log(mediaGallery);
    return this.firestoreService.save(mediaGallery, 'media-galleries', 'media-gallery');
  }

  galleryChanged($event: any) {
    console.log($event);
    /* const control = this.form.controls[path];
    control.setValue(value);
    control.markAsDirty(); */
  }

}
