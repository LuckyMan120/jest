import { Sponsor } from '@sponsor/_interfaces/sponsor.interface';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';


export const onSponsorWrite = functions.region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 30 })
  .firestore.document('/sponsors/{sponsorId}')
  .onWrite(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    console.log('TODO: update assignedCategories and assignedArticles if values change');

    const promises: Promise<any>[] = [];
    const beforeData = change.before.data() as Sponsor;
    const afterData = change.after.data() as Sponsor;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }


    /* const valuesToUpdate: any = {};
    valuesToUpdate['assignedCategoryTitles'] = await getAssignedFieldValue(afterData.assignedCategoryIds, 'categories', 'title');
    valuesToUpdate['assignedArticleTitles'] = await getAssignedFieldValue(afterData.assignedArticleIds, 'articles', 'title');
    if (Object.keys(valuesToUpdate).length === 0 && valuesToUpdate.constructor === Object) {
      promises.push(change.after.ref.set(valuesToUpdate, { merge: true }));
    } */

    return await Promise.all(promises);

  });

