import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { Team } from '../shared/_interfaces/team.interface';
import { getTeamTitle } from './../app-functions';
import { TEAM_INDEX } from './../app/algolia';

export const onTeamUpdate = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 25 })
  .firestore.document('/teams/{teamId}')
  .onUpdate(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises: Promise<any>[] = [];
    const afterData = change.after.data() as Team;
    const beforeData = change.before.data() as Team;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    let assignedSeasonTitle: string = '';
    if (getTeamTitle(afterData) !== getTeamTitle(beforeData) || afterData.assignedSeasonId !== beforeData.assignedSeasonId) {
      if (afterData.assignedSeasonId) {
        assignedSeasonTitle = ((await admin.firestore().collection('seasons').doc(afterData.assignedSeasonId).get()).data())?.title || '';
      }
      await TEAM_INDEX.saveObject({ title: getTeamTitle(afterData), objectID: afterData.id, assignedSeasonTitle });
    }

    /* if (getTeamTitle(afterData as any) !== getTeamTitle(beforeData as any)) {
      ([
        { inputField: 'assignedTeamIds', titleField: 'assignedTeamTitles', collection: 'articles' },
        { inputField: 'assignedTeamId', titleField: 'assignedTeamTitle', collection: 'matches' },
        { inputField: 'assignedTeamIds', titleField: 'assignedTeamTitles', multiple: true, collection: 'trainings' },
      ] as ContentType[]).map(c => promises.push(updateSingleField(c.collection, c.idField, '==', context.params.teamId, afterData, c.titleField as string, getTeamTitle)));
    }

    const assignedCategoryTitles: string[] = [];
    if (afterData.assignedCategoryIds && afterData.assignedCategoryIds !== beforeData.assignedCategoryIds) {
      const categoryPromises = afterData.assignedCategoryIds.map((categoryId: string) => admin.firestore().doc(`categories/${categoryId}`).get());
      const categories = (await Promise.all(categoryPromises)).map(category => category.data() as Category);
      categories.forEach((category: Category) => assignedCategoryTitles.push(category.title));
    }

    const assignedPlayerTitles: string[] = [];
    if (afterData.assignedPlayerIds && afterData.assignedPlayerIds !== beforeData.assignedPlayerIds) {
      const playerPromises = afterData.assignedPlayerIds.map((playerId: string) => admin.firestore().doc(`players/${playerId}`).get());
      const players = (await Promise.all(playerPromises)).map(player => player.data() as Player);
      players.forEach((player: Player) => assignedPlayerTitles.push(getUserTitle(player)));
    }

    if (afterData.internMgmt && !_.isEqual(afterData.internMgmt, beforeData.internMgmt)) {
      for (const [i, mgmt] of afterData.internMgmt.entries()) {
        afterData.internMgmt[i].assignedPlayerTitle = getUserTitle(((await admin.firestore().collection('players').doc(mgmt.assignedPlayerId).get()).data() as Player) as any);
        afterData.internMgmt[i].assignedCategoryTitle = ((await admin.firestore().collection('categories').doc(mgmt.assignedCategoryId).get()).data() as Category).title || '';
      }
    }

    if (afterData.externMgmt && !_.isEqual(afterData.externMgmt, beforeData.externMgmt)) {
      for (const [i, mgmt] of afterData.externMgmt.entries()) {
        afterData.externMgmt[i].assignedMemberTitle = getUserTitle(((await admin.firestore().collection('members').doc(mgmt.assignedMemberId).get()).data() as Member) as any);
        afterData.externMgmt[i].assignedCategoryTitle = ((await admin.firestore().collection('categories').doc(mgmt.assignedCategoryId).get()).data() as Category).title || '';
      }
    }

    promises.push(change.after.ref.set({ assignedSeasonTitle, assignedCategoryTitles, assignedPlayerTitles, internMgmt: afterData.internMgmt || [], externMgmt: afterData.externMgmt || [] }, { merge: true }));
    */
    return Promise.all(promises);

  });
