import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { getUserTitle } from './../app-functions';
import { initAlgolia } from './../app/algolia';
import { updateDetailStatisticsCounter } from './../statistics';

export let afterData: User = null;

export const onUserUpdate = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 10 })
  .firestore.document('/users/{userId}')
  .onUpdate(async (change: functions.Change<functions.firestore.QueryDocumentSnapshot>, context: functions.EventContext) => {

    const promises = [];

    afterData = change.after.data() as User;
    
    const beforeData = change.before.data() as User;

    const afterTitle = getUserTitle(change.after.data() as User);
    const beforeTitle = getUserTitle(change.before.data() as User);

    if (beforeData && beforeTitle !== afterTitle) {
      const algolia = await initAlgolia();
      if (algolia) {
        const USER_INDEX = algolia.initIndex('users');
        promises.push(USER_INDEX.saveObject({ title: afterTitle, objectID: afterData.id }));
      }
    }

    if (beforeData && beforeTitle !== afterTitle ||
      !_.isEqual(beforeData.assignedRoles, afterData.assignedRoles) ||
      beforeData.photoUrl !== afterData.photoUrl) {

      // console.log(beforeTitle, afterTitle);
      // console.log(beforeData.photoUrl, afterData.photoUrl);
      // console.log(beforeData.assignedRoles, afterData.assignedRoles);
      console.log('ToDo: Update all fields if userTitle has changed');
      /*  update all creation-by and publications-by
      const collections = ['articles', 'categories', 'clubs', 'locations', 'matches',
      'medias', 'members', 'players', 'roles', 'seasons', 'seniors', 'teams'];

      const updateCreation = collections.map(collection => ({ collection, inputField: 'creation.by',
      comparisonOperator: '==' as WhereFilterOp, inputValue: context.params.userId, outputField: 'creation.user', outputFn: getUserData }));

      const creationPromises = updateCreation.map((e: any) => updateSingleField(e.collection, e.inputField,
        e.comparisonOperator, e.inputValue, afterData, e.outputField, {}, e.outputFn));
      promises.push(...creationPromises); */
    }

    if (beforeData && !_.isEqual(beforeData.assignedRoles, afterData.assignedRoles)) {

      let oldRoles = [];
      if (beforeData.assignedRoles) {
        const oldKeys = Object.keys(beforeData.assignedRoles);
        oldRoles = oldKeys.filter((key) => beforeData.assignedRoles[key]);
      }

      let newRoles = [];
      if (afterData.assignedRoles) {
        const newKeys = Object.keys(afterData.assignedRoles);
        newRoles = newKeys.filter((key) => afterData.assignedRoles[key]);
      }

      const unusedRoles = oldRoles?.filter(role => !newRoles.includes(role));
      const usedRoles = newRoles?.filter(role => !oldRoles.includes(role));

      const unusedStatsPromises = unusedRoles.map((role: string) =>
        updateDetailStatisticsCounter(`user`, role, admin.firestore.FieldValue.increment(-1))
      );
      promises.push(...unusedStatsPromises);


      const usedStatsPromises = usedRoles.map((role: string) =>
        updateDetailStatisticsCounter(`user`, role, admin.firestore.FieldValue.increment(1))
      );
      promises.push(...usedStatsPromises);

      const unusedPromises = unusedRoles.map(role => admin.firestore().collection(`roles`).where('title', '==', role).get());
      const unsed = await Promise.all(unusedPromises);
      const unusedRolesPromises = unsed.map(col => {
        col.docs.map(doc => {
          const assignedUserIds = doc.data().assignedUserIds.filter((id: string) => id !== context.params.userId);
          return doc.ref.set({ assignedUserIds }, { merge: true });
        });
      });
      promises.push(...unusedRolesPromises);

      const usedPromises = usedRoles.map(role => admin.firestore().collection(`roles`).where('title', '==', role).get());
      const used = await Promise.all(usedPromises);

      const usedRolesPromises = used.map(col => {
        return col.docs.map(doc => {
          const assignedUserIds = doc.data().assignedUserIds || [];
          if (!assignedUserIds.includes(context.params.userId)) {
            assignedUserIds.push(context.params.userId);
          }
          return doc.ref.set({ assignedUserIds }, { merge: true });
        });
      });
      promises.push(...usedRolesPromises);
    }

    if (afterData.disabled !== beforeData.disabled || afterData.emailVerified !== beforeData.emailVerified) {
      promises.push(admin.auth().updateUser(afterData.id, {
        emailVerified: afterData.emailVerified || false,
        disabled: afterData.disabled || false
      }));
    }

    return await Promise.all(promises);

  });
