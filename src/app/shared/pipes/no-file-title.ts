import { Pipe, PipeTransform } from '@angular/core';
import { MediaItem } from './../_interfaces/media-item.interface';

@Pipe({
  name: 'noFileTitle'
})
export class NoFileTitlePipe implements PipeTransform {

  constructor() { }

  transform(mediaItems: MediaItem[]): MediaItem[] {
    return mediaItems.filter((mediaItem) => !mediaItem.fileTitle);
  }

}
