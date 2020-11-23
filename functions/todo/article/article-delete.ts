import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateDocumentsOnDelete } from '../app-functions';
import { ARTICLE_INDEX } from '../app/algolia';
import { createLatestDoc, updateStatisticsCounter } from './../index';
import { ContentType } from './../shared/_interfaces/content-type.interface';

export const onArticleDelete = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 10 })
  .firestore.document('/articles/{articleId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    const promises: Promise<any>[] = [];

    ARTICLE_INDEX.deleteObject(context.params.articleId);

    const contentTypes: ContentType[] = [
      { inputField: 'assignedArticleId', titleField: 'assignedArticleTitle', multiple: false, collection: 'timeline' },
      { inputField: 'assignedArticleId', titleField: 'assignedArticleTitle', multiple: false, collection: 'club-honorary' }
    ];
    promises.push(updateDocumentsOnDelete(snapshot.id, contentTypes));

    promises.push(createLatestDoc(`articles`, 'latest-article'));
    promises.push(updateStatisticsCounter('article', admin.firestore.FieldValue.increment(-1)));

    /* if (snapshot.data().publication && snapshot.data().publication.status) {
      const statisticsToUpdate = {};
      statisticsToUpdate[snapshot.data().publication.status] = admin.firestore.FieldValue.increment(-1);
      admin.firestore().collection(`statistics`).doc(`article-statistics`).set(statisticsToUpdate, { merge: true });
    }*/

    return Promise.all(promises);

  });
