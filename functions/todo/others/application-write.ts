import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { Application } from '../shared/_interfaces/application.interface';
import { Category } from '../shared/_interfaces/category.interface';
import DocumentSnapshot = admin.firestore.DocumentSnapshot;

export const onApplicationWrite = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 10 })
  .firestore.document('/applications/{applicationId}')
  .onWrite(async (change: functions.Change<DocumentSnapshot>, context: functions.EventContext) => {

    const afterData = change.after.data() as Application;
    const beforeData = change.before.data() as Application;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (afterData.assignedLinks && !_.isEqual(afterData.assignedLinks, beforeData.assignedLinks)) {
      for (const [i, link] of afterData.assignedLinks.entries()) {
        const categoryDoc = await admin.firestore().collection('categories').doc(link.assignedCategoryId).get();
        const category = categoryDoc.data() as Category;
        afterData.assignedLinks[i].assignedCategoryTitle = category.title;
      }
      change.after.ref.set({ assignedLinks: afterData.assignedLinks }, { merge: true });
    }

    return true;
  });
