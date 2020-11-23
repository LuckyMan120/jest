import { Category } from '@category/_interfaces/category.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateDocumentsOnDelete } from '../app-functions';
import { generateDetailedCategoryStatistics } from './../app-functions';
import { initAlgolia } from './../app/algolia';
import { createLatestDoc, updateStatisticsCounter } from './../statistics';

export const onCategoryDelete = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 8 })
  .firestore.document('/categories/{categoryId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const category = snapshot.data() as Category;

    const p1 = createLatestDoc(`categories`, 'latest-category', 'title');
    const p2 = updateStatisticsCounter('Kategorien', admin.firestore.FieldValue.increment(-1));

    const p3 = updateDocumentsOnDelete(snapshot.id, [
      { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'articles' },
      { inputField: 'parentCategoryIds', titleField: 'parentCategoryTitles', multiple: true, collection: 'categories' },
      { inputField: 'assignedCategoryId', titleField: 'assignedCategoryTitle', multiple: false, collection: 'club-management' },
      { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'matches' },
      { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'sponsors' },
      { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'teams' },
    ]);

    const algolia = await initAlgolia();
    if (algolia) {
      const CATEGORY_INDEX = algolia.initIndex('categories');
      promises.push(CATEGORY_INDEX.deleteObject(context.params.categoryId));
    }

    if (category.assignedCategoryIds) {
      promises.push(generateDetailedCategoryStatistics(category.assignedCategoryIds, [], 'category'));
    }

    return await Promise.all([p1, p2, p3, ...promises]);
  });

