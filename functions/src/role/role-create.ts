import { Role } from '@role/_interfaces/role.interface';
import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const onRoleCreate = functions
  .region('europe-west1')
  .runWith({ memory: '256MB', timeoutSeconds: 10 })
  .firestore.document('/roles/{roleId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const role = snapshot.data() as Role;

    if (!role) {
      return true;
    }

    if (role.assignedUserIds) {
      const userPromises = role.assignedUserIds.map(id => admin.firestore().doc(`users/${id}`).get());
      const users = await Promise.all(userPromises);
      const updatePromises = users.map(doc => {
        const user = doc.data() as User;
        user.assignedRoles[role.title] = true;
        return admin.firestore().doc(`users/${user.id}`).set(user);
      });
      promises.push(updatePromises);
    }

    return await Promise.all(promises);

  });
