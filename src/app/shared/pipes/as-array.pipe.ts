import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asArray'
})

export class AsArrayPipe implements PipeTransform {

  transform(value: string) {
    if (!!!value) { return null; }

    if (Array.isArray(value)) { return value; }

    return [value];
  }
}
