import { BaseInterface } from './base.interface';

export interface SocialPosting extends BaseInterface {
  message: string;
  link: string | undefined;
  imageURL: string | undefined;
  startDate: number;
  type: 'facebook' | 'twitter';
  mode: 'link' | 'photo';
}
