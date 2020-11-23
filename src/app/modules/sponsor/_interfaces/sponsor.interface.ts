import { BaseInterface } from '../../../shared/_interfaces/base.interface';
import { ExternalContact } from '../../../shared/_interfaces/contact.interface';
import { Address } from './../../../shared/_interfaces/address.interface';

export interface Sponsor extends BaseInterface {
  displayInFooter: boolean;
  displayOnHomepage: boolean;
  displayAsTopSponsor: boolean;
  internalInfo: string;
  description: string;
  externalLink?: string;
  address: Address;

  startDate?: number | undefined;
  endDate?: number | undefined;

  assignedCategoryIds?: string[];
  assignedCategoryTitles?: string[];

  assignedArticleIds?: string[];
  assignedArticleTitles?: string[];

  contact: ExternalContact;

  revenue: number;
  galleries?: {
    Firmenlogos: {
      title: 'Firmenlogos'
    },
    Ansprechpartner: {
      title: 'Ansprechpartner'
    },
    Werbeanzeigen: {
      title: 'Werbeanzeigen'
    },
    Werbevideos: {
      title: 'Werbevideos'
    }
  };
  files?: {
    Dokumente: {
      title: 'Dokumente'
    }
  };
}
