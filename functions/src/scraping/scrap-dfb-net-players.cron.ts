import * as functions from 'firebase-functions';
import { sendToWebHook } from '../app/slack.config';
import { getConfig, getDefaultAdmin } from './../db';
import { createInfoMail } from './../shared/_classes/mail-engine';
import { NotificationEngine } from './../shared/_classes/notification-engine';
import { DfbnetImporter } from './../shared/_classes/scraping/dfbnetImporter';

const _cronScrapDFBnetPlayers = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 25 })
  .pubsub.schedule('0 0 1 * *') // Cron at At 05:00.
  .timeZone('Europe/Berlin')
  .onRun(async () => {

    console.log('version 2.1');
    const promises = [];

    try {

      const config = await getConfig();
      const defaultAdmin = await getDefaultAdmin();

      const result = await DfbnetImporter.import(config?.dfbnet.username, config?.dfbnet.password, defaultAdmin);
      const text = `[cronScrapDFBnetPlayers] Spieler wurde per Cronjob überprüft:
      ${result.newUsers} neue Spieler, ${result.updatedUsers} geänderte Spieler`;
      promises.push(sendToWebHook({ icon_emoji: ':alarm_clock:', text }));

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'DFB.net Spieler-Import',
        Variables: {
          text,
          title: 'Automatischer DFB.net Spieler-Import'
        }
      }));
      await Promise.all(promises);
      return text;

    } catch (e) {
      const text = `[cronScrapDFBnetPlayers] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'DFB.net Spieler-Import',
        Variables: {
          text,
          title: 'Automatischer DFB.net Spieler-Import'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      throw text;
    }

  });

export const cronScrapDFBnetPlayers = _cronScrapDFBnetPlayers;
