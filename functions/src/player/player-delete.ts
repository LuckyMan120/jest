import { Player } from '@player/_interfaces/player.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateDocumentsOnDelete } from '../app-functions';
import { createLatestDoc, updateStatisticsCounter } from '../statistics';
import { getUserTitle } from './../app-functions';
import { initAlgolia } from './../app/algolia';
import { updateDetailStatisticsCounter } from './../statistics';

export const onPlayerDelete = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 20 })
  .firestore.document('/players/{playerId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const player = snapshot.data() as Player;

    const p1 = createLatestDoc(`players`, 'latest-player', undefined, getUserTitle);
    const p2 = updateStatisticsCounter('Spieler', admin.firestore.FieldValue.increment(-1));

    const algolia = await initAlgolia();
    if (algolia) {
      const PLAYER_INDEX = algolia.initIndex('players');
      promises.push(PLAYER_INDEX.deleteObject(context.params.playerId));
    }

    const updateLinkedDocuments = [];
    if (player.assignedMemberId) {
      // eslint-disable-next-line max-len
      updateLinkedDocuments.push({ inputField: 'assignedPlayerId', titleField: 'assignedPlayerTitle', multiple: false, collection: 'members', deleteCompleteEntity: false });
    }
    if (player.assignedSeniorId) {
      // eslint-disable-next-line max-len
      updateLinkedDocuments.push({ inputField: 'assignedPlayerId', titleField: 'assignedPlayerTitle', multiple: false, collection: 'seniors', deleteCompleteEntity: false });
    }

    const p3 = updateDocumentsOnDelete(snapshot.id, updateLinkedDocuments);

    const p4 = updateDocumentsOnDelete(snapshot.id, [
      // eslint-disable-next-line max-len
      { inputField: 'internMgmtPlayerIds', titleField: 'internMgmtPlayerIds', multiple: true, collection: 'teams', deleteCompleteEntity: false },
      // eslint-disable-next-line max-len
      { inputField: 'assignedPlayerIds', titleField: 'assignedPlayerTitles', multiple: true, collection: 'teams', deleteCompleteEntity: false }
    ]);

    promises.push(updateDetailStatisticsCounter(`player`, player.ageGroup, admin.firestore.FieldValue.increment(-1)));

    return await Promise.all([p1, p2, p3, p4, ...promises]);
  });
