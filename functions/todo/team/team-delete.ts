import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateDocumentsOnDelete } from '../app-functions';
import { TEAM_INDEX } from '../app/algolia';
import { createLatestDoc, updateStatisticsCounter } from './../index';

export const onTeamDelete = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 20 })
  .firestore.document('/teams/{teamId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    await TEAM_INDEX.deleteObject(snapshot.id);

    const p1 = updateDocumentsOnDelete(snapshot.id, [
      { inputField: 'assignedTeamIds', titleField: 'assignedTeamIds', multiple: true, collection: 'articles', deleteCompleteEntity: false },
      { inputField: 'assignedTeamId', titleField: 'assignedTeamTitle', multiple: false, collection: 'matches', deleteCompleteEntity: true },
      { inputField: 'assignedTeamIds', titleField: 'assignedTeamTitles', multiple: true, collection: 'trainings', deleteCompleteEntity: true }
    ]);
    const p2 = createLatestDoc('teams', 'latest-team');
    const p3 = updateStatisticsCounter('team', admin.firestore.FieldValue.increment(-1));

    return Promise.all([p1, p2, p3]);
  });
