import { Application } from '@application/_interfaces/application.interface';
import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as gravatarUrl from 'gravatar-url';
import { currentApplication } from './../db';

export const onUserAuthCreate = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 15 })
  .auth.user()
  .onCreate(async (user: admin.auth.UserRecord, context: functions.EventContext) => {

    console.log('version 1.1');

    const promises = [];

    if (!user) {
      return true;
    }

    try {
      const fsUser: User = {
        id: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoURL || gravatarUrl(user.email || Math.random().toString(36).substring(7), { default: 'mm' }),
        assignedRoles: {},
        galleries: { Profilfotos: { title: 'Profilfotos' } },
        lastSignInTime: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).valueOf() : new Date().valueOf(),
        creationTime: user.metadata.creationTime ? new Date(user.metadata.creationTime).valueOf() : new Date().valueOf(),
        providerIds: user.providerData.map(data => data.providerId)
      };

      const userCount = (await admin.firestore().collection('users').get()).size;

      if (userCount === 0) {

        promises.push(admin.firestore().doc('applications/currentApplication').set({ adminUserId: user.uid }, { merge: true }));
        fsUser.isGodAdmin = true;

        const roles = (await admin.firestore().collection('roles').get()).docs;
        roles.map(role => fsUser[role.data().title] = true);

      } else {
        // disable user by default
        promises.push(admin.auth().updateUser(user.uid, { disabled: true }));
        const defaultRoleId = ((await currentApplication()).data() as Application)?.registration.defaultRole;
        const defaultRole = await admin.firestore().collection(`roles`).doc(defaultRoleId).get();
        fsUser.assignedRoles[defaultRole.data().title] = true;
        fsUser.disabled = true;
      }


      /* if (fsUser.assignedRoles) {
        promises.push(
          Object.entries(fsUser.assignedRoles).filter(([key, value]) => value === true)
            .map(([key, value]) => updateDetailStatisticsCounter(`user`, key, admin.firestore.FieldValue.increment(1)))
        );


        const rolePromises = Object.entries(fsUser.assignedRoles).filter(([key, value]) => value === true)
          .map(([key, value]) => admin.firestore().collection(`roles`).where('title', '==', key).get());

        const roles = await Promise.all(rolePromises);

        const updateRolesPromises = roles.map(col => {
          return col.docs.map(doc => {
            const assignedUserIds = doc.data().assignedUserIds || [];
            assignedUserIds.push(user.uid);
            return doc.ref.set({ assignedUserIds }, { merge: true });
          });
        });
        promises.push(...updateRolesPromises);
      } */


      promises.push(admin.firestore().collection('users').doc(user.uid).set(fsUser, { merge: true }));
      await Promise.all(promises);

      return { success: true };

    } catch (e) {
      return { error: e };
    }
  });
