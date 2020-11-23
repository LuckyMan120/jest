import { Senior } from '@senior/_interfaces/senior.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateDocumentsOnDelete } from '../app-functions';
import { createLatestDoc, updateStatisticsCounter } from '../statistics';
import { getUserTitle } from './../app-functions';
import { initAlgolia } from './../app/algolia';

export const onSeniorDelete = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 20 })
  .firestore.document('/seniors/{seniorId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const senior = snapshot.data() as Senior;

    const p1 = createLatestDoc(`seniors`, 'latest-senior', undefined, getUserTitle);
    const p2 = updateStatisticsCounter('AH-Mitglieder', admin.firestore.FieldValue.increment(-1));

    const algolia = await initAlgolia();
    if (algolia) {
      const PLAYER_INDEX = algolia.initIndex('seniors');
      promises.push(PLAYER_INDEX.deleteObject(context.params.seniorId));
    }

    const updateLinkedDocuments = [];
    if (senior.assignedMemberId) {
      // eslint-disable-next-line max-len
      updateLinkedDocuments.push({ inputField: 'assignedSeniorId', titleField: 'assignedSeniorTitle', multiple: false, collection: 'members', deleteCompleteEntity: false });
    }
    if (senior.assignedPlayerId) {
      // eslint-disable-next-line max-len
      updateLinkedDocuments.push({ inputField: 'assignedSeniorId', titleField: 'assignedSeniorTitle', multiple: false, collection: 'players', deleteCompleteEntity: false });
    }

    const p3 = updateDocumentsOnDelete(snapshot.id, updateLinkedDocuments);

    return await Promise.all([p1, p2, p3, ...promises]);
  });
