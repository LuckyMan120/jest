import { BaseInterface } from '../../../shared/_interfaces/base.interface';
import { Address } from './../../../shared/_interfaces/address.interface';

export interface Club extends BaseInterface {

  galleries?: {
    Vereinswappen: {
      title: 'Vereinswappen'
    }
  };
  files?: {
    'Anträge und Formulare': {
      title: 'Anträge und Formulare'
    }
  };

  logo?: {};
  managementImage?: {};
  managementImageDescription?: string;

  fussballdeUrl?: string;
  address: Address;

  founding?: string;
  clubColours?: string;

  assignedLocationIds: string[];
  assignedLocationTitles?: string[];

}
