import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { Article } from '../shared/_interfaces/article.interface';
import { TimeLineEvent } from '../shared/_interfaces/timeline.interface';
import DocumentSnapshot = admin.firestore.DocumentSnapshot;

export const onTimelineWrite = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 25 })
  .firestore.document('/timeline/{timelineId}')
  .onWrite(async (change: functions.Change<DocumentSnapshot>, context: functions.EventContext) => {

    const afterData = change.after.data() as TimeLineEvent;
    const beforeData = change.before.data() as TimeLineEvent;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    const article = await admin.firestore().collection('articles').doc(afterData.assignedArticleId).get();
    return change.after.ref.set({ assignedArticleTitle: (article.data() as Article).title }, { merge: true });

  });
