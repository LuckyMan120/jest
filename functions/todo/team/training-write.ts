import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { Location } from '../shared/_interfaces/location.interface';
import { Season } from '../shared/_interfaces/season.interface';
import { Training } from '../shared/_interfaces/training.interface';
import { getTeamTitle } from './../app-functions';
import { Team } from './../shared/_interfaces/team.interface';

export const onTrainingWrite = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 10 })
  .firestore.document('/trainings/{trainingId}')
  .onWrite(async (change: functions.Change<functions.firestore.DocumentSnapshot>, context: functions.EventContext) => {

    const beforeData = change.before.data() as Training;
    const afterData = change.after.data() as Training;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    const season = await admin.firestore().collection('seasons').doc(afterData.assignedSeasonId).get();
    const assignedSeasonTitle = (season.data() as Season).title;

    const location = await admin.firestore().collection('locations').doc(afterData.assignedLocationId).get();
    const assignedLocationTitle = (location.data() as Location).title;

    const assignedTeamTitles: string[] = [];
    if (afterData.assignedTeamIds) {
      const teamPromises = afterData.assignedTeamIds.map((teamId: string) => admin.firestore().doc(`teams/${teamId}`).get());
      const teams = (await Promise.all(teamPromises)).map(team => team.data() as Team);
      teams.forEach((team: Team) => assignedTeamTitles.push(getTeamTitle(team as any)));
    }

    return change.after.ref.set({ assignedSeasonTitle, assignedLocationTitle, assignedTeamTitles }, { merge: true });
  });
