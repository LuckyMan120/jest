import { Category } from '@category/_interfaces/category.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { generateDetailedCategoryStatistics, setAssignedCategoryTitles } from './../app-functions';
import { initAlgolia } from './../app/algolia';
import { updateStatisticsCounter } from './../statistics';

export const onCategoryCreate = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 15 })
  .firestore.document('/categories/{categoryId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const category = snapshot.data() as Category;

    if (!category) {
      return true;
    }

    const algolia = await initAlgolia();
    if (algolia) {
      const CATEGORY_INDEX = algolia.initIndex('categories');
      promises.push(CATEGORY_INDEX.saveObject({ objectID: category.id, title: category.title }));
    }

    promises.push(admin.firestore().collection('statistics').doc('latest-category').set({
      id: context.params.categoryId,
      title: category.title
    }, { merge: true }));
    promises.push(updateStatisticsCounter('Kategorien', admin.firestore.FieldValue.increment(1)));

    if (category.assignedCategoryIds) {
      promises.push(generateDetailedCategoryStatistics([], category.assignedCategoryIds, 'category'));
      promises.push(setAssignedCategoryTitles(category.assignedCategoryIds, snapshot.ref));
    }

    return await Promise.all([...promises]);

  });
