import { Senior } from '@senior/_interfaces/senior.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { getUserTitle } from '../app-functions';
import { updateStatisticsCounter } from '../statistics';
import { initAlgolia } from './../app/algolia';
moment.locale('de');

export const onSeniorCreate = functions
  .region('europe-west1')
  .runWith({ memory: '256MB', timeoutSeconds: 10 })
  .firestore.document('/seniors/{seniorId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const senior = snapshot.data() as Senior;

    if (!senior) {
      return true;
    }

    const algolia = await initAlgolia();
    if (algolia) {
      const PLAYER_INDEX = algolia.initIndex('seniors');

      promises.push(PLAYER_INDEX.saveObject({
        firstName: senior.firstName,
        lastName: senior.lastName,
        title: getUserTitle(senior as any),
        birthDate: senior.birthDate,
        objectID: senior.id,
        gerLocale: moment(senior.birthDate).format('DD.MM.YYYY')
      }));
    }

    // eslint-disable-next-line max-len
    promises.push(admin.firestore().collection('statistics').doc('latest-senior').set({ id: context.params.seniorId, title: getUserTitle(senior) }, { merge: true }));
    promises.push(updateStatisticsCounter('AH-Mitglieder', admin.firestore.FieldValue.increment(1)));

    return await Promise.all(promises);

  });
