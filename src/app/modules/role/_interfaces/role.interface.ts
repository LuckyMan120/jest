import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface Role extends BaseInterface {
  id?: string;
  isCoreRole: boolean;
  assignedPermissions: string[];
  assignedUserIds?: string[];
}
