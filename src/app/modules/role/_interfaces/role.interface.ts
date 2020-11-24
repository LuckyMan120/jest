import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface Role extends BaseInterface {
  isCoreRole: boolean;
  assignedPermissionIds: string[];
  assignedUserIds?: string[];
}
