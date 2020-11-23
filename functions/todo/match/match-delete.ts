import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { MATCH_INDEX } from '../app/algolia';
import { createLatestDoc, updateStatisticsCounter } from './../index';

export const onMatchDelete = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 20 })
  .firestore.document('/matches/{matchId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    // const data = snapshot.data() as Match;

    MATCH_INDEX.deleteObject(snapshot.id);

    const p1 = createLatestDoc('matches', 'latest-match');
    const p2 = updateStatisticsCounter('match', admin.firestore.FieldValue.increment(-1));

    /* if (data.isCompleted && data.result) {
    updateMatchStatistics(snapshot.data()?.assignedTeamId, snapshot.data()?.isHomeTeam, snapshot.data()?.isOtherEvent, snapshot.data()?.result, admin.firestore.FieldValue.increment(-1));
  } */

    return Promise.all([p1, p2]);
  });
