import { Application } from '@application/_interfaces/application.interface';
import { Link } from '@application/_interfaces/link.interface';
import { MailList } from '@application/_interfaces/mail-list.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import DocumentSnapshot = admin.firestore.DocumentSnapshot;

export const onApplicationWrite = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 10 })
  .firestore.document('/applications/{applicationId}')
  .onWrite(async (change: functions.Change<DocumentSnapshot>, context: functions.EventContext) => {

    const promises: any[] = [];
    const afterData = change.after.data() as Application;
    const beforeData = change.before.data() as Application;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (!beforeData || !_.isEqual(afterData.mailing, beforeData.mailing)) {

      const categoryPromises = afterData.mailing.map((mailList: MailList) =>
        admin.firestore().collection('categories').doc(mailList.assignedCategoryId).get()
      );
      const categories = await Promise.all(categoryPromises);
      categories.map((cat) => {
        const filteredMailLists = afterData.mailing.filter((mailList: MailList) => cat.id === mailList.assignedCategoryId);
        filteredMailLists.map((mailList: MailList) => mailList.assignedCategoryTitle = cat.data().title);
      });
      promises.push(change.after.ref.set({ mailing: afterData.mailing }, { merge: true }));
    }

    if (!beforeData || !_.isEqual(afterData.assignedLinks, beforeData.assignedLinks)) {

      const categoryPromises = afterData.assignedLinks.map((link: Link) =>
        admin.firestore().collection('categories').doc(link.assignedCategoryId).get()
      );
      const categories = await Promise.all(categoryPromises);
      categories.map((cat) => {
        const filteredLinks = afterData.assignedLinks.filter(link => cat.id === link.assignedCategoryId);
        filteredLinks.map(link => link.assignedCategoryTitle = cat.data().title);
      });
      promises.push(change.after.ref.set({ assignedLinks: afterData.assignedLinks }, { merge: true }));
    }

    return await Promise.all(promises);
  });
