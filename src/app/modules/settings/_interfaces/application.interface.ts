import { BaseInterface } from '@shared/_interfaces/base.interface';
import { MenuItem } from '@shared/_interfaces/menu-item.interface';
import { Calendar } from './calendar.interface';
import { Link } from './link.interface';
import { MailList } from './mail-list.interface';

export interface Application extends BaseInterface {
  adminUserId: string;
  algolia: {
    id: string;
    key: string
  };
  colours: string[],
  communities: string[];
  dfbnet: {
    username: string;
    password: string;
  };
  fussball: {
    clubId: string;
    endDateOffset: number;
    startDate: number;
  };
  googleKeys: {
    spreadsheets: string;
    maps: string;
    calendar: string;
  };
  mailjet: {
    key: string;
    secret: string;
  };
  googleDriveMemberSheet: string;
  slackWebHookUrl: string;

  site: {
    author: string;
    backendUrl: string;
    description: string;
    frontendUrl: string;
    email: string;
    keywords: string;
    logo: string;
    subTitle: string;
    title: string;
  };

  assignedCalendars?: Calendar[];

  urlShortening:
  | {
    title: string;
    key: string;
  }
  | number;

  registration: {
    isEnabled: boolean;
    defaultRole: string;
  };

  downtime: {
    isEnabled: boolean;
    message: string;
  };

  mailing?: MailList[];

  assignedLinks?: Link[];

  socialProviders?: [
    { type: string, clientId: string }
  ] | [];

  webhooks?: [
    { type: string, url: string }
  ] | [];

  frontendMenu?: MenuItem[];
}
