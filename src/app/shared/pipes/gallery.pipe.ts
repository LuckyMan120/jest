import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gallery'
})
export class GalleryPipe implements PipeTransform {

  transform(value: any, args: number): any {

    const result = [];
    const keys = Object.keys(value);

    for (const key of keys) {

      const v = value[key];

      if (v.hasOwnProperty(args)) {
        result.push({ key, value: v[args] });
      }
    }

    return result;
  }

}
