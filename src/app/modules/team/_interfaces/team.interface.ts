import { BaseInterface } from '../../../shared/_interfaces/base.interface';
import { TeamExternManagement, TeamInternManagement } from './team-management.interface';

export interface Team extends BaseInterface {

  logoURL?: string;
  externalTeamLink?: string;
  title: string;
  subTitle?: string;

  id?: string;

  assignedSeasonId?: string;
  assignedSeasonTitle?: string;

  isOfficialTeam?: boolean;
  isSignedOut?: boolean;
  isValid?: boolean;
  isMainTeam?: boolean;
  displayInMainMenu?: boolean;

  assignedCategoryIds: string[];
  assignedCategoryTitles?: string[];

  info?: string;

  internMgmt?: TeamInternManagement[];
  internMgmtCategoryIds?: string[];
  internMgmtPlayerIds?: string[];
  externMgmt?: TeamExternManagement[];
  externMgmtCategoryIds?: string[];
  externMgmtMemberIds?: string[];

  assignedPlayerIds?: string[];
  assignedPlayerTitles?: string[];

  standings?: {
    clubLink: string;
    clubTitle: string;
    clubLogo: string;
    draw: string;
    goalDiff: string;
    goalRatio: string;
    icon: string;
    loss: string;
    matches: string;
    points: string;
    rank: string;
    won: string;
  };

  homeAwayStandings?: {
    title: 'string';
    standings: string;
  };

  roundStandings?: {
    title: 'string';
    standings: string;
  };

  ticker?: {
    link: string;
    publicationDate: number;
    title: string;
  }[];

  teamInfo?: {
    Wettbewerb: string;
    Tabellenplatz: string;
    Punkte: string;
    'Torverhältnis': string;
    Spielklasse: string;
  };

  imageUrl?: string;

  competitions?: {
    link: string;
    title: string;
  }[];

  galleries?: {
    Mannschaftsfotos: {}
  };

}
