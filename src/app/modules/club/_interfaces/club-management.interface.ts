import { BaseInterface } from '../../../shared/_interfaces/base.interface';
import { Category } from './../../category/_interfaces/category.interface';
import { Member } from './../../member/_interfaces/member.interface';

export interface ClubManagement extends BaseInterface {

  assignedMemberId: string;
  assignedMember?: Member;
  assignedMemberTitle?: string;

  assignedCategoryId: string;
  assignedCategory?: Category;
  assignedCategoryTitle?: string;

  startDate: number;
  endDate?: number | null;
}
