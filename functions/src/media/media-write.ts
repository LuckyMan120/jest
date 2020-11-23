import { Category } from '@category/_interfaces/category.interface';
import { DocumentSnapshot, FieldValue } from '@google-cloud/firestore';
import { MediaItem } from '@shared/_interfaces/media-item.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { checkForChangedData } from './../app-functions';

export const onMediaWrite = functions.region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 30 })
  .firestore.document('/medias/{mediaId}')
  .onWrite(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises: any[] = [];
    const beforeData = change.before.data() as MediaItem;
    const afterData = change.after.data() as MediaItem;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (checkForChangedData(beforeData, afterData, 'assignedCategoryIds', 'assignedCategoryTitles')) {

      if (afterData.assignedCategoryIds) {
        const catPr = afterData.assignedCategoryIds?.map(catId => admin.firestore().doc(`categories/${catId}`).get());
        const snaps = await Promise.all(catPr);
        const assignedCategoryTitles = snaps.map((cat: DocumentSnapshot) => cat.data()).map((cat: Category) => cat.title);
        promises.push(change.after.ref.set({ assignedCategoryTitles }, { merge: true }));

      } else {
        promises.push(change.after.ref.set({ assignedCategoryTitles: FieldValue.delete() }, { merge: true }));
      }
    }

    return Promise.all(promises);

  });

