import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface Category extends BaseInterface {

  description?: string;
  isCoreCategory?: boolean;

  assignedCategoryIds?: string[];
  assignedCategoryTitles?: string[];

  parsingValues?: string[];
  title: string;
}
