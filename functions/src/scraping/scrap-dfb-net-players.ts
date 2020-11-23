import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { sendToWebHook } from './../app/slack.config';
import { getConfig, getDefaultAdmin } from './../db';
import { createInfoMail } from './../shared/_classes/mail-engine';
import { NotificationEngine } from './../shared/_classes/notification-engine';
import { DfbnetImporter } from './../shared/_classes/scraping/dfbnetImporter';
import { isUserAllowedToCallFn } from './index';

const _callScrapDFBnetPlayers = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .https.onCall(async (data: any, context: CallableContext) => {

    console.log('version 2.1');
    const promises = [];

    try {

      await isUserAllowedToCallFn(context.auth?.uid);

      const config = await getConfig();
      const defaultAdmin = await getDefaultAdmin(context.auth?.uid);

      const result = await DfbnetImporter.import(config?.dfbnet.username, config?.dfbnet.password, defaultAdmin);
      // eslint-disable-next-line max-len
      const text = `[callScrapDFBnetPlayers] Spieler wurde per Cronjob überprüft: ${result.newUsers} neue Spieler, ${result.updatedUsers} geänderte Spieler`;
      promises.push(sendToWebHook({ icon_emoji: ':clap:', text }));
      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'DFB.net Spieler-Import',
        Variables: {
          text,
          title: 'Manueller DFB.net Spieler-Import'
        }
      }));
      await Promise.all(promises);
      return text;

    } catch (e) {

      const text = `[callScrapDFBnetPlayers] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'DFB.net Spieler-Import',
        Variables: {
          text,
          title: 'Fehler: Manueller DFB.net Spieler-Import'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      throw new functions.https.HttpsError('internal', text);

    }
  });

export const callScrapDFBnetPlayers = _callScrapDFBnetPlayers;

const _reqScrapDFBnetPlayers = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    console.log('version 2.1');
    const promises = [];

    try {

      const config = await getConfig();
      const defaultAdmin = await getDefaultAdmin();

      const result = await DfbnetImporter.import(config?.dfbnet.username, config?.dfbnet.password, defaultAdmin);
      // eslint-disable-next-line max-len
      const text = `[reqScrapDFBnetPlayers] Spieler wurde per Cronjob überprüft: ${result.newUsers} neue Spieler, ${result.updatedUsers} geänderte Spieler`;
      promises.push(sendToWebHook({ icon_emoji: ':clap:', text }));
      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'DFB.net Spieler-Import',
        Variables: {
          text,
          title: 'Manueller DFB.net Spieler-Import'
        }
      }));
      await Promise.all(promises);
      resp.status(200).send(text);

    } catch (e) {
      const text = `[reqScrapDFBnetPlayers] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'DFB.net Spieler-Import',
        Variables: {
          text,
          title: 'Fehler: Manueller DFB.net Spieler-Import'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      resp.status(500).send(text);

    }
  });

export const reqScrapDFBnetPlayers = _reqScrapDFBnetPlayers;
