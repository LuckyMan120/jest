import { Club } from '@club/_interfaces/club.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { createResultArray } from '../app-functions';

export const onClubWrite = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 10 })
  .firestore.document('/clubs/{clubId}')
  .onWrite(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises = [];
    const beforeData = change.before.data() as Club;
    const afterData = change.after.data() as Club;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (afterData.assignedLocationIds && afterData.assignedLocationIds.length > 0) {
      const locationDocs = await admin.firestore().collection('locations').where('id', 'in', afterData.assignedLocationIds).get();
      const assignedLocationTitles = createResultArray(locationDocs.docs, 'title');
      promises.push(change.after.ref.set({ assignedLocationTitles }, { merge: true }));
    }

    /* if (afterData.assignedMemberIds && afterData.assignedMemberIds.length > 0) {
      const memberDocs = await admin.firestore().collection('members').where('id', 'in', afterData.assignedMemberIds).get();
      const assignedMemberTitles = createResultArray(memberDocs.docs, getUserTitle);
      promises.push(change.after.ref.set({ assignedMemberTitles }, { merge: true }));
    } */

    return Promise.all(promises);
  });
