import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { NotificationEngine } from '../shared/_classes/notification-engine';
import { sendToWebHook } from './../app/slack.config';
import { createInfoMail } from './../shared/_classes/mail-engine';

const _cronMonthlyPlayerStatistics = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .pubsub.schedule('0 0 1 * *') // At 00:00 on day-of-month 1 // monthly
  .timeZone('Europe/Berlin')
  .onRun(async context => {

    console.log('version 1.0');

    const toUpdate = {};
    const currentMonth = moment();
    const promises = [];

    try {

      const promise = await admin.firestore().collection(`players`).get();
      const playerList = promise.docs;

      const ageGroups = promise.docs.map(doc => doc.data().ageGroup);
      const uniqueAgeGroups = [...new Set(ageGroups)];

      const playersByAgeGroup = uniqueAgeGroups.map(
        ageGroup => ({
          ageGroup,
          size: playerList.filter(player => player.data().ageGroup === ageGroup).length,
          items: playerList
            .filter(player => player.data().ageGroup === ageGroup)
            .map(player => ({
              firstName: player.data().firstName,
              lastName: player.data().lastName,
              id: player.data().id,
              birthDate: player.data().birthDate
            }))
        })
      );

      toUpdate[currentMonth.format('YYYY-MM')] = playersByAgeGroup;

      promises.push(admin.firestore().collection('statistics').doc(`player-detail-statistics`).set(toUpdate, { merge: true }));
      const text = `Die Spielerstatistik für den Monat ${currentMonth.format('MM.YYYY')} wurde erstellt.`;
      promises.push(sendToWebHook({ icon_emoji: ':alarm_clock:', text }));

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Monatliche Spielerstatistik',
        Variables: {
          text,
          title: 'Automatische Erstellung der Spielerstatistik'
        }
      }));
      await Promise.all(promises);
      return toUpdate;

    } catch (e) {
      const text = `[cronGoogleCalendarExport] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Monatliche Spielerstatistik',
        Variables: {
          text,
          title: 'Automatische Erstellung der Spielerstatistik'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      throw text;
    }


  });

export const cronMonthlyPlayerStatistics = _cronMonthlyPlayerStatistics;


const _reqMonthlyPlayerStatistics = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 25 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    console.log('version 1.0');

    const toUpdate = {};
    const currentMonth = moment().format('YYYY-MM');

    try {

      const promise = await admin.firestore().collection(`players`).get();
      const playerList = promise.docs;

      const ageGroups = promise.docs.map(doc => doc.data().ageGroup);
      const uniqueAgeGroups = [...new Set(ageGroups)];

      const playersByAgeGroup = uniqueAgeGroups.map(
        ageGroup => ({
          ageGroup,
          size: playerList.filter(player => player.data().ageGroup === ageGroup).length,
          items: playerList
            .filter(player => player.data().ageGroup === ageGroup)
            .map(player => ({
              firstName: player.data().firstName,
              lastName: player.data().lastName,
              id: player.data().id,
              birthDate: player.data().birthDate
            }))
        })
      );

      toUpdate[currentMonth] = playersByAgeGroup;

      await admin.firestore().collection('statistics').doc(`player-detail-statistics`).set(toUpdate, { merge: true });

      resp.status(200).send(toUpdate);
    } catch (e) {
      resp.status(500).send(e.message);
    }

  });

export const reqMonthlyPlayerStatistics = _reqMonthlyPlayerStatistics;
