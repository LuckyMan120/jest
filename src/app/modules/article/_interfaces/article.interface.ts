import { BaseInterface } from '../../../shared/_interfaces/base.interface';

export interface Article extends BaseInterface {
  excerpt: string;
  text: string;
  subTitle?: string;
  articleDate: number;

  image?: string;
  link?: string; // TODO

  galleries: {};

  assignedCategoryIds?: string[];
  assignedCategoryTitles?: string[];

  assignedLocationIds?: string[];
  assignedLocationTitles?: string[];

  assignedMatchIds?: string[];
  assignedMatchTitles?: string[];

  assignedTeamIds?: string[];
  assignedTeamTitles?: string[];

  displayInFooter?: boolean;
  displayInBackendFooter?: boolean;
  displayInArticleList?: boolean;

  displayInMenu?: boolean;
  displayInClubFooter?: boolean;

  menuDisplay?: boolean;

  isFeaturedPost?: boolean;
  meta?: any;
};
