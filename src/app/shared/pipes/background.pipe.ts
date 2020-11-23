import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'background'
})

export class BackgroundPipe implements PipeTransform {

  transform(value: string) {
    return `url("${value}")`;
  }
}
