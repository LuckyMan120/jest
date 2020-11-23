import { BaseInterface } from './base.interface';

export interface Season extends BaseInterface {
  description?: string;
  endDate: string;
  startDate: string;
}
