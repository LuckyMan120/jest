import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slug'
})
export class SlugPipe implements PipeTransform {

  transform(title: string | undefined, reTransform = false) {
    if (!title) {
      return;
    }
    if (reTransform) {
      return title.replace(/-/g, ' ');
    } else {
      return title.replace(/ /g, '-'); // trim().toLowerCase()
    }

  }

}
