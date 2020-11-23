import { Address } from '../../../shared/_interfaces/address.interface';
import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface Location extends BaseInterface {

  text?: string;

  assignedCategoryIds?: string[];
  assignedCategoryTitles?: string[];

  marker?: any;
  fupaLink?: string;
  opening?: string;
  prices?: string;
  isNew?: boolean;
  address: Address;
  title: string;

  galleries?: {
    Profilfotos?: {}
  };
}
