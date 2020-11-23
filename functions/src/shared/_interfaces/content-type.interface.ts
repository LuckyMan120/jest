import { WhereFilterOp } from '@google-cloud/firestore';
export interface ContentType {

  inputField: string;
  inputValue?: string;
  operator?: WhereFilterOp;

  titleField?: string;
  multiple?: boolean;
  collection: 'articles' | 'categories' | 'clubs' | 'locations' | 'matches'
  | 'members' | 'players' | 'seniors' | 'sponsors' | 'teams' | 'users' | 'roles'
  | 'timeline' | 'club-honorary' | 'club-management' | 'trainings';

  deleteCompleteEntity?: boolean;
}
