import { Sponsor } from '@sponsor/_interfaces/sponsor.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateStatisticsCounter } from '../statistics';

export const onSponsorCreate = functions
  .region('europe-west1')
  .runWith({ memory: '256MB', timeoutSeconds: 10 })
  .firestore.document('/sponsors/{sponsorId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const sponsor = snapshot.data() as Sponsor;

    if (!sponsor) {
      return true;
    }


    promises.push(admin.firestore().collection('statistics').doc('latest-sponsor').set({
      id: context.params.sponsorId,
      title: sponsor.title
    }, { merge: true }));
    promises.push(updateStatisticsCounter('Sponsoren', admin.firestore.FieldValue.increment(1)));

    return await Promise.all(promises);

  });
