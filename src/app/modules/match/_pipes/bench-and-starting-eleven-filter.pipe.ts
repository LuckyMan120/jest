import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'benchAndStartingElevenFilter'
})
export class BenchAndStartingElevenFilterPipe implements PipeTransform {

  transform(assginedPlayerIds: string[], match: any): unknown {

    if (!match || !match.startingElevenIds || !match.benchIds) {
      return assginedPlayerIds;
    }

    return null;
  }

}
