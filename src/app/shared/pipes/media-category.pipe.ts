import { Pipe, PipeTransform } from '@angular/core';
import { MediaItem } from './../_interfaces/media-item.interface';

@Pipe({
  name: 'mediaCategoryFilter'
})
export class MediaCategoryFilterPipe implements PipeTransform {

  transform(mediaItems: MediaItem[], assignedCategoryIds: string[]): any {

    if (!assignedCategoryIds || assignedCategoryIds.length === 0) {
      return mediaItems;
    }

    console.log(assignedCategoryIds);

    for (const mediaItem of mediaItems) {
      console.log(mediaItem);
    }

    return mediaItems.map((mediaItem: MediaItem) => {
      console.log(mediaItem.assignedCategoryIds);
      return mediaItem;
      /* if (mediaItem.assignedCategoryIds) {
        return mediaItem.assignedCategoryIds.some(id => assignedCategoryIds.indexOf(id) > -1 ? mediaItem : null);
      } else {
        return mediaItem;
      } */
    });
  }

}
