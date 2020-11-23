import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface CalEvent extends BaseInterface {
  created?: any;
  creator?: {
    email: string,
    displayName: string,
  };
  end: any;
  etag?: string;
  htmlLink?: string;
  allDayEvent?: boolean;
  iCalUID?: string;
  kind?: string;
  location?: string;
  organizer?: {
    email?: string;
    displayName?: string;
    self?: string;
  };
  sequence?: string;
  start: any;
  status?: any;
  summary?: string;
  updated?: string;
}
