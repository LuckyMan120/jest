import { Location } from '@location/_interfaces/location.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateDocumentsOnDelete } from '../app-functions';
import { updateStatisticsCounter } from '../statistics';
import { generateDetailedCategoryStatistics } from './../app-functions';
import { initAlgolia } from './../app/algolia';
import { createLatestDoc } from './../statistics';

export const onLocationDelete = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 10 })
  .firestore.document('/locations/{locationId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const location = snapshot.data() as Location;

    const p1 = createLatestDoc('locations', 'latest-location');
    const p2 = updateStatisticsCounter('Spielorte', admin.firestore.FieldValue.increment(-1));

    const p3 = updateDocumentsOnDelete(snapshot.id, [
      // eslint-disable-next-line max-len
      { inputField: 'assignedLocationId', titleField: 'assignedLocationTitle', multiple: false, collection: 'matches', deleteCompleteEntity: true },
      // eslint-disable-next-line max-len
      { inputField: 'assignedLocationId', titleField: 'assignedLocationTitle', multiple: false, collection: 'trainings', deleteCompleteEntity: true },
      // eslint-disable-next-line max-len
      { inputField: 'assignedLocationIds', titleField: 'assignedLocationTitles', multiple: true, collection: 'articles', deleteCompleteEntity: false },
      // eslint-disable-next-line max-len
      { inputField: 'assignedLocationIds', titleField: 'assignedLocationTitles', multiple: true, collection: 'clubs', deleteCompleteEntity: false }
    ]);

    const algolia = await initAlgolia();
    if (algolia) {
      const LOCATION_INDEX = algolia.initIndex('locations');
      promises.push(LOCATION_INDEX.deleteObject(context.params.locationId));
    }

    if (location.assignedCategoryIds) {
      promises.push(generateDetailedCategoryStatistics(location.assignedCategoryIds, [], 'location'));
    }

    return await Promise.all([p1, p2, p3, ...promises]);

  });
