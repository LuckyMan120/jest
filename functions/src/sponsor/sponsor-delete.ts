import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { createLatestDoc, updateStatisticsCounter } from './../statistics';

export const onSponsorDelete = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 10 })
  .firestore.document('/sponsors/{sponsorsId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    const promises: Promise<any>[] = [];

    promises.push(createLatestDoc('sponsors', 'latest-sponsor', 'title'));
    promises.push(updateStatisticsCounter('Sponsoren', admin.firestore.FieldValue.increment(-1)));

    return await Promise.all(promises);
  });

