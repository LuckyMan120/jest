import { Member } from '@member/_interfaces/member.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { getUserTitle } from './../app-functions';
import { initAlgolia } from './../app/algolia';
import { updateStatisticsCounter } from './../statistics';
moment.locale('de');

export const onMemberCreate = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 25 })
  .firestore.document('/members/{memberId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const member = snapshot.data() as Member;

    if (!member) {
      return true;
    }

    const algolia = await initAlgolia();
    if (algolia) {
      const MEMBER_INDEX = algolia.initIndex('members');

      promises.push(MEMBER_INDEX.saveObject({
        firstName: member.firstName,
        lastName: member.lastName,
        title: getUserTitle(member),
        birthDate: member.birthDate,
        objectID: member.id,
        gerLocale: moment(member.birthDate).format('DD.MM.YYYY')
      }));
    }

    // eslint-disable-next-line max-len
    promises.push(admin.firestore().collection('statistics').doc('latest-member').set({ id: context.params.memberId, title: getUserTitle(member) }, { merge: true }));
    promises.push(updateStatisticsCounter('Mitglieder', admin.firestore.FieldValue.increment(1)));

    return await Promise.all([...promises]);

  });
