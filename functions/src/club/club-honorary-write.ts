import { ClubHonorary } from '@club/_interfaces/club-honorary.interface';
import { Member } from '@member/_interfaces/member.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { getUserTitle } from './../app-functions';

export const onClubHonoraryWrite = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 5 })
  .firestore.document('/club-honorary/{honoraryId}')
  .onWrite(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const afterData = change.after.data() as ClubHonorary;
    const beforeData = change.before.data() as ClubHonorary;

    const promises = [];

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    promises.push(admin.firestore().collection('members').doc(afterData.assignedMemberId).get());

    if (afterData.assignedArticleId) {
      promises.push(admin.firestore().collection('articles').doc(afterData.assignedArticleId).get());
    }
    const result = await Promise.all(promises);

    const assignedMemberTitle = getUserTitle(result[0].data() as Member);

    let assignedArticleTitle = null;
    if (result[1]) {
      assignedArticleTitle = result[1].data()?.title;
    }

    return change.after.ref.set({ assignedArticleTitle, assignedMemberTitle }, { merge: true });
  });
