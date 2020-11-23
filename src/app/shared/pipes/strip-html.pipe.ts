import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHTML'
})

export class StripHtmlPipe implements PipeTransform {
  transform(value: string): any {

    if (!value) {
      return;
    }

    return value.replace(/<.*?>/g, ''); // replace tags
  }
}
