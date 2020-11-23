import { BaseInterface } from './base.interface';

export interface MediaItem extends BaseInterface {

  creation: {
    by: string;
    at: number;
  };

  fileTitle?: string;

  metadata: {
    documentPath: string;

    fileExtension: string;
    fileSize: number;
    fileType: string;
    fileName: string;

    galleryName: string;
    resizedImage: boolean;
    size: string;
    sizes: string;
    tags: string;
  };

  originalUrl: string;

  id: string;

  sizes: {}[];

  assignedCategoryIds: string[];
  assignedCategoryTitles: string;
}
