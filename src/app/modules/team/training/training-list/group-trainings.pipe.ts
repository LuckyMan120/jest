import { Pipe, PipeTransform } from '@angular/core';
import { groupBy, mergeIntervals } from './merge-overlapping-intervals';

@Pipe({
  name: 'groupTrainings'
})

export class GroupTrainingsPipe implements PipeTransform {
  transform(value: any[], ...args: any[]): any {

    const result: any = [];
    const groupedByDate = groupBy('day')(value);

    Object.keys(groupedByDate).forEach((day) => {

      const elements = groupedByDate[day];
      const intervales = elements.map((p: any) => {
        const s = getTime(p.startTime);
        const e = getTime(p.endTime);
        return [+s, +e];
      });

      const mergedIntervales = mergeIntervals(intervales);


      mergedIntervales.forEach((mergedIntervale: any) => {
        const start = mergedIntervale[0];
        const end = mergedIntervale[1];


        const mergedStartTime = new Date();
        mergedStartTime.setHours(start.toString().substring(0, 2));
        mergedStartTime.setMinutes(start.toString().substring(2, 4));
        const mergedEndTime = new Date();
        mergedEndTime.setHours(end.toString().substring(0, 2));
        mergedEndTime.setMinutes(end.toString().substring(2, 4));
        let mergedDiff = 0;
        mergedDiff += (mergedEndTime.getHours() - mergedStartTime.getHours()) * 60;
        mergedDiff += (mergedEndTime.getMinutes() - mergedStartTime.getMinutes());
        mergedDiff /= 15;


        const tmpR = elements.filter((el: any) => {
          const s = getTime(el.startTime);
          const e = getTime(el.endTime);
          return (+s) >= start && (+e) <= end;
        });


        result.push({
          day: +day,
          startSlot: start,
          endSlot: end,
          values: tmpR.map((el: any) => {
            const elStartTime = new Date(el.startTime);
            const elEndTime = new Date(el.endTime);

            let rDiff = 0;
            rDiff += (elStartTime.getHours() - mergedStartTime.getHours()) * 60;
            rDiff += (elStartTime.getMinutes() - mergedStartTime.getMinutes());
            rDiff /= 15;
            rDiff += 1;



            let reDiff = 0;
            reDiff += (mergedEndTime.getHours() - elEndTime.getHours()) * 60;
            reDiff += (mergedEndTime.getMinutes() - elEndTime.getMinutes());
            reDiff /= 15;
            reDiff = mergedDiff - reDiff + 1;


            return {
              ...el, spanRow: `${rDiff} / ${reDiff}`, elStartTime, elEndTime
            };

          })
        });
      });

    });

    return result;
  }
}

function getTime(unixTimeStamp: string) {
  return new Date(unixTimeStamp).toTimeString().slice(0, 5).replace(':', '');
}
