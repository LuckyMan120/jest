import { Location } from '@location/_interfaces/location.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateStatisticsCounter } from './../statistics';

export const onLocationCreate = functions.region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 30 })
  .firestore.document('/locations/{locationId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const location = snapshot.data() as Location;

    if (!location) {
      return true;
    }

    // eslint-disable-next-line max-len
    promises.push(admin.firestore().collection('statistics').doc('latest-location').set({ id: context.params.locationId, title: location.title }));
    promises.push(updateStatisticsCounter('Spielorte', admin.firestore.FieldValue.increment(1)));

    return await Promise.all(promises);

  });

