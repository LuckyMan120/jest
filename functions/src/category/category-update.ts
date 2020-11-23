import { Category } from '@category/_interfaces/category.interface';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { generateDetailedCategoryStatistics, setAssignedCategoryTitles, updateSingleField } from '../app-functions';
import { initAlgolia } from '../app/algolia';
import { ContentType } from '../shared/_interfaces/content-type.interface';

export const onCategoryUpdate = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 15 })
  .firestore.document('/categories/{categoryId}')
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises = [];
    const afterData = change.after.data() as Category;
    const beforeData = change.before.data() as Category;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }


    if (afterData.title !== beforeData.title) {
      const algolia = await initAlgolia();
      if (algolia) {
        const CATEGORY_INDEX = algolia.initIndex('categories');
        promises.push(CATEGORY_INDEX.saveObject({ objectID: afterData.id, title: afterData.title }));
      }
    }


    if (!_.isEqual(beforeData.assignedCategoryIds, afterData.assignedCategoryIds)) {
      // eslint-disable-next-line max-len
      promises.push(generateDetailedCategoryStatistics(beforeData ? beforeData.assignedCategoryIds : [], afterData.assignedCategoryIds, 'category'));
      promises.push(setAssignedCategoryTitles(afterData.assignedCategoryIds, change.after.ref));
    }


    if (beforeData.title !== afterData.title) {

      const contentTypes: ContentType[] = [
        { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'articles' },
        // { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'categories' },
        { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'sponsors' },
        { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'locations' },
        { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'matches' },
        { inputField: 'assignedCategoryIds', titleField: 'assignedCategoryTitles', multiple: true, collection: 'teams' },

        { inputField: 'assignedCategoryId', titleField: 'assignedCategoryTitle', multiple: false, collection: 'club-management' },
      ];

      // eslint-disable-next-line max-len
      promises.push(contentTypes.map(c => updateSingleField(c.collection, c.inputField, c.multiple ? 'array-contains' : '==', context.params.categoryId, afterData, c.titleField)));
    }

    return await Promise.all(promises);

  });
