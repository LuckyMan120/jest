import { DocumentReference, WriteResult } from '@google-cloud/firestore';
import { Member } from '@member/_interfaces/member.interface';
import { Player } from '@player/_interfaces/player.interface';
import { Senior } from '@senior/_interfaces/senior.interface';
import { User } from '@user/_interfaces/user.interface';
import * as moment from 'moment';
moment.locale('de');

export class Birthday {

  public calculateAge = (birthDate: moment.Moment) => moment().diff(birthDate, 'years');

  public getBirthDate = (birthDate: number | undefined): moment.Moment | undefined => {
    if (!birthDate) {
      return undefined;
    }
    const utcOffset = moment(birthDate).utcOffset();
    return moment(birthDate).add(utcOffset, 'minutes');
  }


  public saveBirthdayAndBirthMonthDay = async (
    docRef: DocumentReference,
    item: Player | Senior | Member | User
  ): Promise<void | WriteResult> => {

    if (typeof item.birthDate !== 'undefined' && item.birthDate) {
      const birthDate = new Birthday().getBirthDate(item.birthDate as number);
      if (birthDate) {
        return docRef.set({ birthMonthDay: birthDate.format('MM-DD') }, { merge: true });
      }
    }
    return Promise.resolve();
  }

}
