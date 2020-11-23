import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { createInfoMail } from '../shared/_classes/mail-engine';
import { NotificationEngine } from '../shared/_classes/notification-engine';
import { sendToWebHook } from './../app/slack.config';

const _callUpdateStatsCounter = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .https.onCall(async (data: any, context: CallableContext) => {

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
          title: 'Manueller Statistik Updater'
        }
      }));
      return 'text';

    } catch (e) {
      const text = `[callScrapDFBnetPlayers] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Statistik Updater',
        Variables: {
          text,
          title: 'Manueller Statistik Updater'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      throw text;
    }

  });

export const callUpdateStatsCounter = _callUpdateStatsCounter;

/*
const _reqUpdateStatsCounter = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

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
          title: 'Manueller Statistik Updater'
        }
      }));

      resp.status(200).send(true);

    } catch (e) {
      const text = `[reqUpdateStatsCounter] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Statistik Updater',
        Variables: {
          text,
          title: 'Manueller Statistik Updater'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      resp.status(500).send(text);
    }

  });

export const reqUpdateStatsCounter = _reqUpdateStatsCounter; */
