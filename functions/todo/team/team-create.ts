import * as functions from 'firebase-functions';
import { Team } from '../shared/_interfaces/team.interface';

export const onTeamWrite = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 25 })
  .firestore.document('/teams/{teamId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    const promises: Promise<any>[] = [];
    const team = snapshot.data() as Team;

    if (!team) {
      return true;
    }

    /* let assignedSeasonTitle: string = '';
    if (team.assignedSeasonId) {
      assignedSeasonTitle = ((await admin.firestore().collection('seasons').doc(team.assignedSeasonId).get()).data() as Season).title || '';
    }
    await TEAM_INDEX.saveObject({ title: getTeamTitle(team), objectID: context.params.teamId, assignedSeasonTitle });

    promises.push(admin.firestore().collection('statistics').doc('latest-team').set({ id: context.params.teamId, title: getTeamTitle(team) }));
    promises.push(updateStatisticsCounter('team', admin.firestore.FieldValue.increment(1)));
    // ToDo: Update Team Detail-Stats

    const assignedCategoryTitles: string[] = [];
    if (team.assignedCategoryIds) {
      const categoryPromises = team.assignedCategoryIds.map((categoryId: string) => admin.firestore().doc(`categories/${categoryId}`).get());
      const categories = (await Promise.all(categoryPromises)).map(category => category.data() as Category);
      categories.forEach((category: Category) => assignedCategoryTitles.push(category.title));
    }

    const assignedPlayerTitles: string[] = [];
    if (team.assignedPlayerIds) {
      const playerPromises = team.assignedPlayerIds.map((playerId: string) => admin.firestore().doc(`players/${playerId}`).get());
      const players = (await Promise.all(playerPromises)).map(player => player.data() as Player);
      players.forEach((player: Player) => assignedPlayerTitles.push(getUserTitle(player)));
    }

    if (team.internMgmt) {
      for (const [i, mgmt] of team.internMgmt.entries()) {
        team.internMgmt[i].assignedPlayerTitle = getUserTitle(((await admin.firestore().collection('players').doc(mgmt.assignedPlayerId).get()).data() as Player) as any);
        team.internMgmt[i].assignedCategoryTitle = ((await admin.firestore().collection('categories').doc(mgmt.assignedCategoryId).get()).data() as Category).title || '';
      }
    }

    if (team.externMgmt) {
      for (const [i, mgmt] of team.externMgmt.entries()) {
        team.externMgmt[i].assignedMemberTitle = getUserTitle(((await admin.firestore().collection('members').doc(mgmt.assignedMemberId).get()).data() as Member) as any);
        team.externMgmt[i].assignedCategoryTitle = ((await admin.firestore().collection('categories').doc(mgmt.assignedCategoryId).get()).data() as Category).title || '';
      }
    }

    promises.push(snapshot.ref.set({ assignedSeasonTitle, assignedCategoryTitles, assignedPlayerTitles, internMgmt: team.internMgmt, externMgmt: team.externMgmt }, { merge: true }));
    */
    return Promise.all(promises);

  });
