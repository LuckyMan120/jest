import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { updateDocumentsOnDelete } from '../app-functions';
import { initAlgolia } from './../app/algolia';
import { ContentType } from './../shared/_interfaces/content-type.interface';
import { createLatestDoc, updateDetailStatisticsCounter, updateStatisticsCounter } from './../statistics';

export const onUserDelete = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 12 })
  .firestore.document('/users/{userId}').onDelete(
    async (snapshot: functions.firestore.DocumentSnapshot, context: functions.EventContext) => {

      const user = snapshot.data() as User;
      const promises = [];

      if (!user || user.isGodAdmin) {
        return true;
      }

      const p1 = admin.auth().deleteUser(context.params.userId);
      const p2 = createLatestDoc(`users`, 'latest-user');
      const p3 = updateStatisticsCounter('Benutzer', admin.firestore.FieldValue.increment(-1));

      const algolia = await initAlgolia();
      if (algolia) {
        const USER_INDEX = algolia.initIndex('users');
        promises.push(USER_INDEX.deleteObject(context.params.userId));
      }

      if (user.assignedRoles) {
        promises.push(
          Object.entries(user.assignedRoles).filter(([key, value]) => value === true)
            .map(([key, value]) => updateDetailStatisticsCounter(`user`, key, admin.firestore.FieldValue.increment(-1)))
        );
      }

      const types: ContentType[] = [{ inputField: 'assignedUserIds', multiple: true, collection: 'roles' }];
      const rolesPromises = updateDocumentsOnDelete(user.id, types);

      return await Promise.all([p1, p2, p3, rolesPromises, ...promises]);
    });
