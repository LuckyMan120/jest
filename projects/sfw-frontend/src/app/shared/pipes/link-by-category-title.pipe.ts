import { Pipe, PipeTransform } from '@angular/core';
import { LinkFilter } from '@application/_interfaces/link-filter.interface';
import { Link } from '@application/_interfaces/link.interface';

@Pipe({
  name: 'linkByCategoryTitle'
})
export class LinkByCategoryTitlePipe implements PipeTransform {

  transform(links: Link[] | undefined, args: LinkFilter): Link[] {
    if (!links) {
      return [];
    }
    const found = links.filter(link => {
      return link.assignedCategoryTitle === args.title
        && link.isActive
        && (args.displayIn ? (link as any)[args.displayIn] === true : true);
    });
    return found;
  }

}
