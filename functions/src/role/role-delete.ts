import { Role } from '@role/_interfaces/role.interface';
import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const onRoleDelete = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 10 })
  .firestore.document('/roles/{roleId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    const promises: any[] = [];

    const role = snapshot.data() as Role;

    if (!role || role.isCoreRole) {
      return true;
    }

    if (role.assignedUserIds) {
      const userPromises = role.assignedUserIds.map(id => admin.firestore().doc(`users/${id}`).get());
      const users = await Promise.all(userPromises);
      const updatePromises = users.map(doc => {
        const user = doc.data() as User;
        delete (user.assignedRoles[role.title]);
        return admin.firestore().doc(`users/${user.id}`).set(user);
      });
      promises.push(updatePromises);
    }

    const statsData = (await admin.firestore().doc(`statistics/user-statistics`).get()).data();
    if (statsData) {
      delete (statsData[role.title]);
      promises.push(admin.firestore().doc(`statistics/user-statistics`).set(statsData));
    }

    return await Promise.all(promises);
  });

