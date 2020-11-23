import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface User extends BaseInterface {

  uid?: string;

  assignedRoles: any;

  galleries: any;

  creationTime?: number;
  lastSignInTime?: number;

  email: string;
  emailVerified?: boolean;
  isGodAdmin?: boolean;

  displayName?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phoneNumber?: string;
  photoUrl: string;
  disabled?: boolean;
  profileImage?: any;
  birthDate?: number | Date;

  providerId?: string;
  providerIds?: string[];

}
