import { GeocodingResult } from '@google/maps';
import { Location } from '@location/_interfaces/location.interface';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import * as moment from 'moment';
import { generateDetailedCategoryStatistics, setAssignedCategoryTitles, updateSingleField } from './../app-functions';
import { initAlgolia } from './../app/algolia';
import { ContentType } from './../shared/_interfaces/content-type.interface';
import { getLocationMarker } from './location-functions';
moment.locale('de');

export const onLocationWrite = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 25 })
  .firestore.document('/locations/{locationId}')
  .onWrite(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises = [];
    const afterData = change.after.data() as Location;
    const beforeData = change.before.data() as Location;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (!beforeData || !_.isEqual(afterData.address, beforeData.address)) {
      const algolia = await initAlgolia();
      if (algolia) {
        const LOCATION_INDEX = algolia.initIndex('locations');

        promises.push(LOCATION_INDEX.saveObject({
          title: afterData.title,
          objectID: context.params.locationId,
          streetName: afterData.address?.streetName,
          city: afterData.address?.city,
          zip: afterData.address?.zip
        }));
      }
    }

    if (!beforeData || !_.isEqual(afterData.address, beforeData.address)) {
      const marker: GeocodingResult[] | undefined = await getLocationMarker(afterData.address);
      if (marker) {
        promises.push(change.after.ref.set({ marker, hasMapMarker: true }, { merge: true }));
      }
    }

    if (!beforeData || !_.isEqual(afterData.assignedCategoryIds, beforeData.assignedCategoryIds)) {
      // eslint-disable-next-line max-len
      promises.push(generateDetailedCategoryStatistics(beforeData ? beforeData.assignedCategoryIds : [], afterData.assignedCategoryIds, 'location'));
      promises.push(setAssignedCategoryTitles(afterData.assignedCategoryIds, change.after.ref));
    }

    if (beforeData && beforeData.title !== afterData.title) {
      const contentTypes: ContentType[] = [
        { inputField: 'assignedLocationIds', titleField: 'assignedLocationTitles', multiple: true, collection: 'articles' },
        { inputField: 'assignedLocationIds', titleField: 'assignedLocationTitles', multiple: true, collection: 'clubs' },

        { inputField: 'assignedLocationId', titleField: 'assignedLocationTitle', multiple: false, collection: 'matches' },
        { inputField: 'assignedLocationId', titleField: 'assignedLocationTitle', multiple: false, collection: 'trainings' },
      ];

      // eslint-disable-next-line max-len
      promises.push(contentTypes.map(c => updateSingleField(c.collection, c.inputField, c.multiple ? 'array-contains' : '==', context.params.locationId, afterData, c.titleField)));
    }

    return await Promise.all(promises);

  });
