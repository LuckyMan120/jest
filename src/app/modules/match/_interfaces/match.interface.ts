import { BaseInterface } from './../../../shared/_interfaces/base.interface';
import { MatchEvent } from './match-event.interface';

export interface MatchResult {
  otherEvent?: number | string | null;
  homeTeamGoals?: number | null;
  guestTeamGoals?: number | null;
}

export interface Match extends BaseInterface {
  id?: string;

  assignedArticleIds?: string[];
  assignedArticleTitles?: string[];

  assignedCategoryTitles?: string[];
  assignedCategoryIds?: string[];

  assignedLocationId?: string;
  assignedLocationTitle?: string;

  assignedTeamId?: string;
  assignedTeamTitle?: string;

  guestTeam?: {
    externalTeamLink: string;
    logoURL: string;
    title: string;
  };

  homeTeam?: {
    externalTeamLink: string;
    logoURL: string;
    title: string;
  };

  isHomeTeam?: boolean;
  isOfficialMatch?: boolean;
  isImported?: boolean;
  isCompleted?: boolean;
  isOtherEvent?: boolean;

  matchType?: string;
  matchLink?: string;
  matchId?: string;

  playersType?: string;
  location?: string;

  matchEndDate?: any;
  matchStartDate: any;

  result?: MatchResult;

  halfTime?: {
    guestTeamGoals: number;
    homeTeamGoals: number;
  }

  matchEvents?: MatchEvent[];

  galleries?: {
    'Fotos zum Spiel': {
      title: 'Fotos zum Spiel'
    }
  };

  startingElevenIds?: string[];
  benchIds?: string[];

  twoLetter?: string;
  rawHTML?: string;
}
