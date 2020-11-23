import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { getMatchTitle, getUserTitle } from './../app-functions';
import { MATCH_INDEX } from './../app/algolia';
import { updateStatisticsCounter } from './../index';
import { Category } from './../shared/_interfaces/category.interface';
import { Location } from './../shared/_interfaces/location.interface';
import { Match } from './../shared/_interfaces/match.interface';
import { Player } from './../shared/_interfaces/player.interface';
import { Team } from './../shared/_interfaces/team.interface';

export const onMatchCreate = functions
  .region('europe-west1')
  .runWith({ memory: '128MB', timeoutSeconds: 5 })
  .firestore.document('/matches/{matchId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    const match = snapshot.data() as Match;

    if (!match) {
      return true;
    }

    MATCH_INDEX.saveObject({ title: getMatchTitle(match), objectID: context.params.matchId, matchStartDate: moment(match.matchStartDate).format('DD.MM.YYYY HH:mm') });

    const promises: Promise<any>[] = [];
    const p1 = admin.firestore().collection('statistics').doc('latest-match').set({ id: context.params.matchId, title: getMatchTitle(match), matchStartDate: moment(match.matchStartDate).format('DD.MM.YYYY HH:mm') });
    const p2 = updateStatisticsCounter('match', admin.firestore.FieldValue.increment(1));

    let assignedLocationTitle: string = '';
    if (match.assignedLocationId) {
      assignedLocationTitle = ((await admin.firestore().collection('locations').doc(match.assignedLocationId).get()).data() as Location).title || '';
    }

    let assignedTeamTitle: string = '';
    if (match.assignedTeamId) {
      assignedTeamTitle = ((await admin.firestore().collection('teams').doc(match.assignedTeamId).get()).data() as Team).title || '';
    }

    const assignedCategoryTitles: string[] = [];
    if (match.assignedCategoryIds) {
      const categoryPromises = match.assignedCategoryIds.map((categoryId: string) => admin.firestore().doc(`categories/${categoryId}`).get());
      const categories = (await Promise.all(categoryPromises)).map(category => category.data() as Category);
      categories.forEach((category: Category) => {
        if (category.title) {
          assignedCategoryTitles.push(category.title);
        }
      });
    }

    if (match.matchEvents) {
      for (const [i, matchEvent] of match.matchEvents.entries()) {
        if (matchEvent.assignedPlayerOneId) {
          match.matchEvents[i].assignedPlayerOneTitle = getUserTitle((await admin.firestore().collection('players').doc(matchEvent.assignedPlayerOneId).get()).data() as Player);
        }
        if (matchEvent.assignedPlayerTwoId) {
          match.matchEvents[i].assignedPlayerTwoTitle = getUserTitle((await admin.firestore().collection('players').doc(matchEvent.assignedPlayerTwoId).get()).data() as Player);
        }
      }
    }

    promises.push(snapshot.ref.set({ assignedLocationTitle, assignedTeamTitle, assignedCategoryTitles, matchEvents: match.matchEvents }, { merge: true }));

    return Promise.all([p1, p2, ...promises]);
  });
