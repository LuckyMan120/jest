import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isEmptyObject'
})
export class IsEmptyObjectPipe implements PipeTransform {

  transform(obj: any): any {

    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

}
