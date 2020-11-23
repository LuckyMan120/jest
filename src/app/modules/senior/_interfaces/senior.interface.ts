import { Address } from '../../../shared/_interfaces/address.interface';
import { BaseInterface } from '../../../shared/_interfaces/base.interface';
import { Contact } from '../../../shared/_interfaces/contact.interface';

export interface Senior extends BaseInterface {
  ahStatus?: string;

  title?: string;
  gender: string;
  firstName: string;
  lastName: string;
  birthDate?: number | Date | null;
  birthMonthDay?: string | null;

  displayName?: string;

  entryDate?: number | Date | null;
  exitDate?: number | Date | null;
  fee?: number;

  address: Address;
  contactData: Contact;

  info?: string;
  comment?: string;

  assignedPlayerId?: string;
  assignedPlayerTitle?: string;

  assignedMemberId?: string;
  assignedMemberTitle?: string;

  galleries: {
    Profilfotos: {
      title: 'Profilfotos'
    }
  };
}
