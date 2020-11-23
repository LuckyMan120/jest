import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface Player extends BaseInterface {
  id?: string;
  passNumber?: number; // string |
  lastName?: string;
  firstName?: string;
  ageGroup?: string;
  displayName?: string;

  age?: number;
  birthDate?: number | Date | null;
  birthMonthDay?: string;
  gender?: string;

  friendlyMatches?: number | Date | null;
  officialMatches?: number | Date | null;
  signOut?: number | Date | null;

  assignedMemberId?: string;
  assignedMemberTitle?: string;

  assignedSeniorId?: string;
  assignedSeniorTitle?: string;

  playerStatus?: string;
  guestPlayer?: {
    guestRight: string;
    season?: string;
    type?: string;
  };
  passPrint?: number | Date | null;
  status?: string;
  homeClub?: string;

  galleries: {
    Profilfotos: {
      title: 'Profilfotos'
    }
  };
}
