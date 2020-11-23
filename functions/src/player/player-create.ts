import { Player } from '@player/_interfaces/player.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { getUserTitle } from '../app-functions';
import { initAlgolia } from './../app/algolia';
import { updateDetailStatisticsCounter, updateStatisticsCounter } from './../statistics';

export const onPlayerCreate = functions
  .region('europe-west1')
  .runWith({ memory: '256MB', timeoutSeconds: 10 })
  .firestore.document('/players/{playerId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    const promises = [];
    const player = snapshot.data() as Player;

    if (!player) {
      return true;
    }

    const algolia = await initAlgolia();
    if (algolia) {
      const PLAYER_INDEX = algolia.initIndex('players');

      promises.push(PLAYER_INDEX.saveObject({
        firstName: player.firstName,
        lastName: player.lastName,
        title: getUserTitle(player as any),
        birthDate: player.birthDate,
        objectID: player.id, gerLocale:
          moment(player.birthDate).format('DD.MM.YYYY')
      }));
    }

    // eslint-disable-next-line max-len
    promises.push(admin.firestore().collection('statistics').doc('latest-player').set({ id: context.params.playerId, title: getUserTitle(player) }, { merge: true }));
    promises.push(updateStatisticsCounter('Spieler', admin.firestore.FieldValue.increment(1)));
    promises.push(updateDetailStatisticsCounter(`player`, player.ageGroup, admin.firestore.FieldValue.increment(1)));

    return await Promise.all(promises);

  });
