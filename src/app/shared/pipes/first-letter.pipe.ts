import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value && value.split(' ').map((n: any[]) => n[0]).join('');
  }
}
