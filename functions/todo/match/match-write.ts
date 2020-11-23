import { FieldValue } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { checkForChangedData } from './../app-functions';
import { Category } from './../shared/_interfaces/category.interface';
import { Location } from './../shared/_interfaces/location.interface';
import { Match } from './../shared/_interfaces/match.interface';
import { Team } from './../shared/_interfaces/team.interface';

export const onMatchWrite = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 30 })
  .firestore.document('/matches/{matchId}')
  .onWrite(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises: Promise<any>[] = [];
    const afterData = change.after.data() as Match;
    const beforeData = change.before.data() as Match;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (checkForChangedData(beforeData, afterData, 'assignedCategoryIds', 'assignedCategoryTitles')) {
      if (afterData.assignedCategoryIds) {
        const assignedCategoryTitles: string[] = [];
        const categoryPromises = afterData.assignedCategoryIds?.map((categoryId: string) => admin.firestore().doc(`categories/${categoryId}`).get());
        const categories = (await Promise.all(categoryPromises)).map(category => category.data() as Category);
        categories.forEach((category: Category) => assignedCategoryTitles.push(category.title));
        promises.push(change.after.ref.set({ assignedCategoryTitles }, { merge: true }));
      } else {
        promises.push(change.after.ref.set({ assignedCategoryTitles: FieldValue.delete() }, { merge: true }));
      }
    }

    if (checkForChangedData(beforeData, afterData, 'assignedLocationId', 'assignedLocationTitle')) {
      if (afterData.assignedLocationId) {
        const assignedLocation = (await admin.firestore().collection('locations').doc(afterData.assignedLocationId).get()).data() as Location;
        promises.push(change.after.ref.set({ assignedLocationTitle: assignedLocation.title }, { merge: true }));
      } else {
        promises.push(change.after.ref.set({ assignedLocationTitle: FieldValue.delete() }, { merge: true }));
      }
    }

    if (checkForChangedData(beforeData, afterData, 'assignedTeamId', 'assignedTeamTitle')) {
      if (afterData.assignedTeamId) {
        const assignedTeam = (await admin.firestore().collection('teams').doc(afterData.assignedTeamId).get()).data() as Team;
        promises.push(change.after.ref.set({ assignedTeamTitle: assignedTeam.title }, { merge: true }));
      } else {
        promises.push(change.after.ref.set({ assignedTeamTitle: FieldValue.delete() }, { merge: true }));
      }
    }

    /*
    if ((!beforeData || !_.isEqual(beforeData.matchEvents, afterData.matchEvents)) && afterData.matchEvents) {
      for (const [i, matchEvent] of afterData.matchEvents.entries()) {
        if (matchEvent.assignedPlayerOneId) {
          const doc = await admin.firestore().collection('players').doc(matchEvent.assignedPlayerOneId).get();
          afterData.matchEvents[i].assignedPlayerOneTitle = getUserTitle(doc.data() as Player);
        }
        if (matchEvent.assignedPlayerTwoId) {
          const doc = await admin.firestore().collection('players').doc(matchEvent.assignedPlayerTwoId).get();
          afterData.matchEvents[i].assignedPlayerTwoTitle = getUserTitle(doc.data() as Player);
        }
        change.after.ref.set({ matchEvents: afterData.matchEvents }, { merge: true });
      }
    } */

    return Promise.all(promises);

  });
