import { Creation } from './creation.interface';
import { Modification } from './modification.interface';
import { Publication } from './publication.interface';

export interface BaseInterface {
  creation?: Creation;
  publication?: Publication;
  modification?: Modification[];
  isImported?: boolean;
  title?: string;
  id?: string;
}
