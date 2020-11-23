import { Role } from '@role/_interfaces/role.interface';
import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const onRoleUpdate = functions
  .region('europe-west1')
  .runWith({ memory: '256MB', timeoutSeconds: 10 })
  .firestore.document('/roles/{roleId}')
  .onUpdate(async (change: functions.Change<functions.firestore.QueryDocumentSnapshot>, context: functions.EventContext) => {

    const promises = [];
    const beforeData = change.before.data() as Role;
    const afterData = change.after.data() as Role;

    if (!afterData) {
      return true;
    }


    if (!beforeData || beforeData.assignedUserIds !== afterData.assignedUserIds || beforeData.title !== afterData.title) {

      const oldUserPromises = beforeData.assignedUserIds
        // .filter(id => !afterData.assignedUserIds.includes(id))
        .map(id => admin.firestore().doc(`users/${id}`).get());
      const oldUsers = await Promise.all(oldUserPromises);
      const oldUpdatePromises = oldUsers.map(doc => {
        const user = doc.data() as User;
        user.assignedRoles[beforeData.title] = false;
        return admin.firestore().doc(`users/${user.id}`).set(user);
      });
      promises.push(oldUpdatePromises);

      const newUserPromises = afterData.assignedUserIds
        // .filter(id => !beforeData.assignedUserIds.includes(id))
        .map(id => admin.firestore().doc(`users/${id}`).get());
      const newUsers = await Promise.all(newUserPromises);
      const newUpdatePromises = newUsers.map(doc => {
        const user = doc.data() as User;
        if (beforeData.title !== afterData.title) {
          delete user.assignedRoles[beforeData.title];
        }
        user.assignedRoles[afterData.title] = true;
        return admin.firestore().doc(`users/${user.id}`).set(user);
      });
      promises.push(newUpdatePromises);
    }

    /* if (beforeData.title !== afterData.title) {
      const statsPromise = await admin.firestore().doc(`statistics/user-statistics`).get();
      const statsData = statsPromise.data();
      statsData[afterData.title] = afterData.assignedUserIds.length;
      delete (statsData[beforeData.title]);
      promises.push(admin.firestore().doc(`statistics/user-statistics`).set(statsData));
    }*/

    return await Promise.all(promises);

  });
