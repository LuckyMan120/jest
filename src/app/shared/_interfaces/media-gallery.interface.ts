import { BaseInterface } from './base.interface';
import { MediaItem } from './media-item.interface';

export interface MediaGallery extends BaseInterface {
  files?: MediaItem[];
  default?: string;
}
