import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { sendToWebHook } from '../app/slack.config';
import { getConfig } from '../db';
import { NotificationEngine } from '../shared/_classes/notification-engine';
import { GoogleSheetImporter } from '../shared/_classes/scraping/googleSheetImporter';
import { getDefaultAdmin } from './../db';
import { createInfoMail } from './../shared/_classes/mail-engine';
import { isUserAllowedToCallFn } from './index';

const _callScrapGoogleDriveMembers = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 8 })
  .https.onCall(async (data: any, context: CallableContext) => {

    console.log('version 2.1');
    const promises = [];

    try {

      await isUserAllowedToCallFn(context.auth?.uid);

      const config = await getConfig();
      const defaultAdmin = await getDefaultAdmin(context.auth?.uid);

      const sheetImporter = new GoogleSheetImporter();

      // const p1 = await sheetImporter.importData('Mitgliederliste', 'members', config, defaultAdmin);
      // if (p1.error) { throw Error(p1.error); }

      const p2 = await sheetImporter.importData('AH-Mitglieder', 'seniors', config, defaultAdmin);
      if (p2.error) {
        throw Error(p2.error);
      }

      const text = `[callScrapGoogleDriveMembers]  ${p2.length} Mitglieder und ${p2.length} AH-Mitglieder importiert.`;
      promises.push(sendToWebHook({ icon_emoji: ':clap:', text }));
      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Google-Drive Mitglieder-Import',
        Variables: {
          text,
          title: 'Manueller Google-Drive Mitglieder-Import'
        }
      }));
      await Promise.all(promises);

      return { members: p2, seniors: p2 };

    } catch (e) {

      const text = `[callScrapGoogleDriveMembers] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Google-Drive Mitglieder-Import',
        Variables: {
          text,
          title: 'Fehler: Manueller Google-Drive Mitglieder-Import'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      throw new functions.https.HttpsError('internal', text);
    }

  });

export const callScrapGoogleDriveMembers = _callScrapGoogleDriveMembers;

const _reqScrapGoogleDriveMembers = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 25 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

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

      const text = `[reqScrapGoogleDriveMembers]  ${p1.length} Mitglieder und ${p2.length} AH-Mitglieder importiert.`;
      promises.push(sendToWebHook({ icon_emoji: ':clap:', text }));
      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Google-Drive Mitglieder-Import',
        Variables: {
          text,
          title: 'Manueller Google-Drive Mitglieder-Import'
        }
      }));
      await Promise.all(promises);
      resp.status(200).send({ members: p1, seniors: p2, text });

    } catch (e) {
      console.log(e);
      const text = `[reqScrapGoogleDriveMembers] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Google-Drive Mitglieder-Import',
        Variables: {
          text,
          title: 'Fehler: Manueller Google-Drive Mitglieder-Import'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      resp.status(500).send(text);
    }
  });

export const reqScrapGoogleDriveMembers = _reqScrapGoogleDriveMembers;
