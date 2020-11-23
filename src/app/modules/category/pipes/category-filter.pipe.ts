import { Pipe, PipeTransform } from '@angular/core';
import { Sponsor } from '../../sponsor/_interfaces/sponsor.interface';

@Pipe({
  name: 'categoryFilter',
  pure: true
})
export class CategoryFilterPipe implements PipeTransform {

  transform(sponsors: Sponsor[], categoryIds: string[]): any[] {

    if (!sponsors || categoryIds.length === 0) {
      return [];
    }

    return sponsors.filter((sponsor: Sponsor) => {
      return categoryIds.some((id: string) => {
        return sponsor.assignedCategoryIds && sponsor.assignedCategoryIds.indexOf(id) > -1;
      });
    });
  }

}
