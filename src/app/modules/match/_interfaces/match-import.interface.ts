import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface MatchImport extends BaseInterface {
  addedCount: number;
  deletedCount: number;
  status: 'started' | 'running' | 'ended' | 'paused';
}
