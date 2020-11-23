import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface ClubHonorary extends BaseInterface {

  assignedArticleId: string;
  assignedArticleTitle?: string;

  assignedMemberId: string;
  assignedMemberTitle?: string;

  startDate: any;
}
