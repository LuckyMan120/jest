import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface TeamInternManagement extends BaseInterface {
  assignedPlayerId: string;
  assignedCategoryId: string;

  assignedPlayerTitle?: string;
  assignedCategoryTitle?: string;
}

export interface TeamExternManagement extends BaseInterface {
  assignedMemberId: string;
  assignedCategoryId: string;

  assignedMemberTitle?: string;
  assignedCategoryTitle?: string;
}
