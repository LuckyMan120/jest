import * as functions from 'firebase-functions';
import { sendToWebHook } from '../app/slack.config';
import { getConfig } from '../db';
import { NotificationEngine } from '../shared/_classes/notification-engine';
import { GoogleSheetImporter } from '../shared/_classes/scraping/googleSheetImporter';
import { getDefaultAdmin } from './../db';
import { createInfoMail } from './../shared/_classes/mail-engine';

const _cronScrapGoogleDriveMembers = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 10 })
  .pubsub.schedule('5 5 * * *') // Cron At 05:05.
  .timeZone('Europe/Berlin')
  .onRun(async context => {

    console.log('version 2.1');
    const promises = [];

    try {

      const config = await getConfig();
      const defaultAdmin = await getDefaultAdmin();

      const sheetImporter = new GoogleSheetImporter();

      const p1 = await sheetImporter.importData('Mitgliederliste', 'members', config, defaultAdmin);
      if (p1.error) {
        throw Error(p1.error);
      }

      const p2 = await sheetImporter.importData('AH-Mitglieder', 'seniors', config, defaultAdmin);
      if (p2.error) {
        throw Error(p2.error);
      }

      const text = `[cronScrapGoogleDriveMembers]  ${p1.length} Mitglieder und ${p2.length} AH-Mitglieder importiert.`;
      promises.push(sendToWebHook({ icon_emoji: ':alarm_clock:', text }));

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Google-Drive Mitglieder-Import',
        Variables: {
          text,
          title: 'Automatischer Google-Drive Mitglieder-Import'
        }
      }));
      await Promise.all(promises);
      return text;

    } catch (e) {
      const text = `[cronScrapGoogleDriveMembers] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Google-Drive Mitglieder-Import',
        Variables: {
          text,
          title: 'Automatischer Google-Drive Mitglieder-Import'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      throw new functions.https.HttpsError('internal', text);
    }

  });

export const cronScrapGoogleDriveMembers = _cronScrapGoogleDriveMembers;
