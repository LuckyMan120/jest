import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgPipesModule } from 'ngx-pipes';
import { FileTypeIconMappingPipe } from '../../pipes/file-type-icon-mapping';
import { BackgroundPipe } from './../../pipes/background.pipe';
import { DisplayFirstMediaPipe } from './../../pipes/display-first-media.pipe';
import { GalleryPipe } from './../../pipes/gallery.pipe';
import { IsEmptyObjectPipe } from './../../pipes/is-empty-object.pipe';
import { MediaCategoryFilterPipe } from './../../pipes/media-category.pipe';
import { NoFileTitlePipe } from './../../pipes/no-file-title';
import { PortletModule } from './../portlet/portlet.module';
import { AddGalleryComponent } from './add-gallery/add-gallery.component';
import { MediaGalleryListComponent } from './media-gallery-list/media-gallery-list.component';
import { MediaGalleryComponent } from './media-gallery/media-gallery.component';
import { MediaInfoComponent } from './media-info/media-info.component';
import { MediaItemComponent } from './media-item/media-item.component';
import { MediaListComponent } from './media-list/media-list.component';
import { MediaPickerComponent } from './media-picker/media-picker.component';
import { MediaSelectorComponent } from './media-selector/media-selector.component';
import { MediaStatisticsComponent } from './media-statistics/media-statistics.component';
import { MediaUploadComponent } from './media-upload/media-upload.component';
import { MediaService } from './media.service';
import { UppyService } from './uppy.service';
import { UppyComponent } from './uppy/uppy.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgPipesModule,
    TabsModule,
    PortletModule,
    ReactiveFormsModule,
    RouterModule,
    InfiniteScrollModule
  ],
  declarations: [
    AddGalleryComponent,
    MediaGalleryComponent,
    MediaGalleryListComponent,
    MediaInfoComponent,
    MediaItemComponent,
    MediaListComponent,
    MediaSelectorComponent,
    MediaUploadComponent,
    UppyComponent,
    DisplayFirstMediaPipe,
    BackgroundPipe,
    GalleryPipe,
    IsEmptyObjectPipe,
    FileTypeIconMappingPipe,
    MediaStatisticsComponent,
    MediaPickerComponent,
    NoFileTitlePipe,
    MediaCategoryFilterPipe
  ],
  exports: [
    AddGalleryComponent,
    MediaGalleryComponent,
    MediaGalleryListComponent,
    MediaInfoComponent,
    MediaItemComponent,
    MediaListComponent,
    MediaSelectorComponent,
    MediaUploadComponent,
    MediaStatisticsComponent,
    UppyComponent,
    DisplayFirstMediaPipe,
    BackgroundPipe,
    GalleryPipe
  ],
  providers: [
    MediaService,
    UppyService
  ]
})
export class MediaModule { }
