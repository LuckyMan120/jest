import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { sendToWebHook } from '../app/slack.config';
import { createInfoMail } from '../shared/_classes/mail-engine';
import { NotificationEngine } from '../shared/_classes/notification-engine';

const _cronUpdateStatsCounter = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .pubsub.schedule('0 * * * *') // Cron At minute 0.
  .timeZone('Europe/Berlin')
  .onRun(async () => {

    console.log('version 2.1');
    const promises = [];

    const cols = ['user'];

    try {

      const colPromises = cols.map(col => admin.firestore().doc(`statistics/${col}-statistics`).get());
      const snapshots = await Promise.all(colPromises);
      const updatePromises = snapshots.map((snap, idx) => {

        const data: any = snap.data();
        const filteredData = Object.entries(data).filter(([key, value]) => value > 0);
        const newData = Object.fromEntries(filteredData);
        return admin.firestore().doc(`statistics/${cols[idx]}-statistics`).set(newData);
      });

      await Promise.all(updatePromises);
      const text = 'Statistiken für die Kategorien ' + cols.join() + ' gesetzt';

      promises.push(sendToWebHook({ icon_emoji: ':check:', text }));
      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Statistik Updater',
        Variables: {
          text,
          title: 'Automatischer Statistik Updater'
        }
      }));
      return 'text';

    } catch (e) {
      const text = `[cronUpdateStatsCounter] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Statistik Updater',
        Variables: {
          text,
          title: 'Automatischer Statistik Updater'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      throw text;
    }

  });

export const cronUpdateStatsCounter = _cronUpdateStatsCounter;
