import { Article } from '@article/_interfaces/article.interface';
import { Observable } from 'rxjs';

export interface MenuItem {
  id: string;
  type?: string;
  value: boolean | number | string | string[];
  multiple?: boolean;
  options?: { value: string | boolean, label: string }[];

  ordering?: number;
  title?: string;
  subMenu?: any;
  link?: string;
  display?: boolean;
  hasMegaMenu?: boolean;
  fixedArticles$?: Observable<Article[]>;
  newestArticles$?: Observable<Article[]>;
}
