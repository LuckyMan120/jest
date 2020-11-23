import { Member } from '@member/_interfaces/member.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateDocumentsOnDelete } from '../app-functions';
import { getUserTitle } from './../app-functions';
import { initAlgolia } from './../app/algolia';
import { createLatestDoc, updateDetailStatisticsCounter, updateStatisticsCounter } from './../statistics';

export const onMemberDelete = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 20 })
  .firestore.document('/members/{memberId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const member = snapshot.data() as Member;

    const p1 = createLatestDoc('members', 'latest-member', undefined, getUserTitle);
    const p2 = updateStatisticsCounter('Mitglieder', admin.firestore.FieldValue.increment(-1));

    const p3 = updateDocumentsOnDelete(snapshot.id, [
      // eslint-disable-next-line max-len
      { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'club-honorary', deleteCompleteEntity: true },
      // eslint-disable-next-line max-len
      { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'club-management', deleteCompleteEntity: true },
      // eslint-disable-next-line max-len
      { inputField: 'assignedMemberIds', titleField: 'assignedMemberTitles', multiple: true, collection: 'clubs', deleteCompleteEntity: false },
      // eslint-disable-next-line max-len
      { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'players', deleteCompleteEntity: false },
      // eslint-disable-next-line max-len
      { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'seniors', deleteCompleteEntity: false },
      // eslint-disable-next-line max-len
      { inputField: 'externMgmtMemberIds', titleField: 'externMgmtMemberIds', multiple: true, collection: 'teams', deleteCompleteEntity: false },
    ]);

    const algolia = await initAlgolia();
    if (algolia) {
      const MEMBER_INDEX = algolia.initIndex('members');
      promises.push(MEMBER_INDEX.deleteObject(snapshot.id));
    }

    if (member.clubStatus) {
      const oldCategory = await admin.firestore().collection('categories').doc(member.clubStatus).get();
      if (oldCategory.exists) {
        promises.push(updateDetailStatisticsCounter(`member`, oldCategory.data().title, admin.firestore.FieldValue.increment(-1)));
      }
    }

    return await Promise.all([p1, p2, p3, ...promises]);

  });
