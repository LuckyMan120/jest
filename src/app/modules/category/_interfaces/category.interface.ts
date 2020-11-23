import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface Category extends BaseInterface {

  description?: string;

  isMainCategory?: boolean;
  isMenuCategory?: boolean;

  assignedCategoryIds?: string[];
  assignedCategoryTitles?: string[];

  parsingValues?: string[];
  isCoreCategory?: boolean;
  title: string;
}
