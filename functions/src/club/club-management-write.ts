import { ClubManagement } from '@club/_interfaces/club-management.interface';
import { Member } from '@member/_interfaces/member.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { getUserTitle } from './../app-functions';

export const onClubManagementWrite = functions
  .region('europe-west1')
  .runWith({ memory: '128MB', timeoutSeconds: 5 })
  .firestore.document('/club-management/{managementId}')
  .onWrite(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const afterData = change.after.data() as ClubManagement;
    const beforeData = change.before.data() as ClubManagement;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    const member = admin.firestore().collection('members').doc(afterData.assignedMemberId).get();
    const category = admin.firestore().collection('categories').doc(afterData.assignedCategoryId).get();

    const [memberDoc, categoryDoc] = await Promise.all([member, category]);

    const assignedMemberTitle = getUserTitle(memberDoc.data() as Member);
    const assignedCategoryTitle = categoryDoc.data()?.title;

    return change.after.ref.set({ assignedCategoryTitle, assignedMemberTitle }, { merge: true });

  });
