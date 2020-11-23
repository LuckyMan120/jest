import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import * as moment from 'moment';
import { getMatchTitle } from './../app-functions';
import { MATCH_INDEX } from './../app/algolia';
import { Match } from './../shared/_interfaces/match.interface';
import DocumentSnapshot = admin.firestore.DocumentSnapshot;

export const onMatchUpdate = functions
  .region('europe-west1')
  .runWith({ memory: '128MB', timeoutSeconds: 5 })
  .firestore.document('/matches/{matchId}')
  .onUpdate(async (change: functions.Change<DocumentSnapshot>, context: functions.EventContext) => {

    const afterData = change.after.data() as Match;
    const beforeData = change.before.data() as Match;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (beforeData.title !== afterData.title || beforeData.matchStartDate !== afterData.matchStartDate || getMatchTitle(beforeData) !== getMatchTitle(afterData)) {
      return MATCH_INDEX.saveObject({ title: getMatchTitle(afterData), matchStartDate: moment(afterData.matchStartDate).format('DD.MM.YYYY HH:mm'), objectID: afterData.id });
    }

    return true;
  });
