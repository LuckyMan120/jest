import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { ARTICLE_INDEX } from '../app/algolia';
import { Article } from '../shared/_interfaces/article.interface';
import { getAssignedFieldValue, getMatchTitle } from './../app-functions';
import { updateStatisticsCounter } from './../statistics';

export const onArticleWrite = functions.region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 30 })
  .firestore.document('/articles/{articleId}')
  .onWrite(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises: Promise<any>[] = [];
    const beforeData = change.before.data() as Article;
    const afterData = change.after.data() as Article;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    const valuesToUpdate: any = {};
    valuesToUpdate['assignedCategoryTitles'] = getAssignedFieldValue(afterData.assignedCategoryIds, 'categories', 'title');
    valuesToUpdate['assignedLocationTitles'] = getAssignedFieldValue(afterData.assignedLocationIds, 'locations', 'title');
    valuesToUpdate['assignedMatchTitles'] = getAssignedFieldValue(afterData.assignedMatchIds, 'matches', getMatchTitle);
    valuesToUpdate['assignedTeamTitles'] = getAssignedFieldValue(afterData.assignedTeamIds, 'teams', getMatchTitle);
    promises.push(change.after.ref.set(valuesToUpdate, { merge: true }));


    if (!beforeData || beforeData.title !== afterData.title) {
      ARTICLE_INDEX.saveObject({ title: afterData.title, objectID: context.params.articleId });
    }

    if (!beforeData) {
      promises.push(admin.firestore().collection('statistics').doc('latest-article').set({ id: context.params.articleId, title: afterData.title }));
      promises.push(updateStatisticsCounter('article', admin.firestore.FieldValue.increment(1)));
      /*if (afterData.publication && afterData.publication.status) {
        const statisticsToUpdate = {};
        statisticsToUpdate[afterData.publication.status] = admin.firestore.FieldValue.increment(1);
        admin.firestore().collection(`statistics`).doc(`article-statistics`).set(statisticsToUpdate, { merge: true });
      }*/
    }

    if (beforeData) {
      if (beforeData.title !== afterData.title) {

        // updateSingleField('club-honorary', 'assignedArticleId', '==', context.params.articleId, afterData, 'title');
        // updateSingleField('timeline', 'assignedArticleId', '==', context.params.articleId, afterData, 'title');

        /* const honoraries = await admin.firestore().collection('club-honorary').where('assignedArticleId', '==', context.params.articleId).get();
        honoraries.docs.map((doc: DocumentSnapshot) => {
          doc.ref.set({ title: afterData.title }, { merge: true });
        });

        const events = await admin.firestore().collection('timeline').where('assignedArticleId', '==', context.params.articleId).get();
        events.docs.map((doc: DocumentSnapshot) => {
          doc.ref.set({ title: afterData.title }, { merge: true });
        }); */
      }

      /*if (afterData.publication && beforeData.publication && beforeData.publication.status !== afterData.publication.status) {
        const statisticsToUpdate = {};
        statisticsToUpdate[beforeData.publication.status] = admin.firestore.FieldValue.increment(-1);
        statisticsToUpdate[afterData.publication.status] = admin.firestore.FieldValue.increment(1);
        admin.firestore().collection(`statistics`).doc(`article-statistics`).set(statisticsToUpdate, { merge: true });
      }*/
    }

    return Promise.all(promises);
  });

