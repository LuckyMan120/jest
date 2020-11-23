import { Address } from '../../../shared/_interfaces/address.interface';
import { BaseInterface } from '../../../shared/_interfaces/base.interface';
import { Contact } from '../../../shared/_interfaces/contact.interface';

export interface Member extends BaseInterface {

  title?: string;
  gender: string;
  firstName: string;
  lastName: string;
  birthDate: number | Date | null;
  birthMonthDay?: string | null;
  displayName?: string;

  address: Address;
  contactData: Contact;

  fee: number;
  clubStatus: string;

  entryDate: number | Date | null;
  exitDate?: number | Date | null;

  info?: string;
  comment: string;
  tasks?: string;

  galleries: {
    'Profilfotos': {
      title: 'Profilfotos'
    };
  };

  assignedPlayerId?: string;
  assignedPlayerTitle?: string;

  assignedSeniorId?: string;
  assignedSeniorTitle?: string;
}
