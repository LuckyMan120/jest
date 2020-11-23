import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as moment from 'moment';
import { isUserAllowedToCallFn } from '.';
import { sendToWebHook } from './../app/slack.config';
import { getConfig } from './../db';
import { createInfoMail } from './../shared/_classes/mail-engine';
import { NotificationEngine } from './../shared/_classes/notification-engine';
import { FussballImporter } from './../shared/_classes/scraping/FussballImporter';
moment.locale('de');

const _callScrapFussballdeMatchplan = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 30 })
  .https.onCall(async (data: any, context: CallableContext) => {

    console.log('version 2.1');
    const promises = [];

    try {

      await isUserAllowedToCallFn(context.auth?.uid);

      const config = await getConfig();

      const startDateParam = moment(config?.fussball.startDate) || moment();
      const endDateParam = moment().add(config?.fussball.endDateOffset, 'month');
      const importer = new FussballImporter();

      const result = await importer.import(startDateParam, endDateParam, config?.fussball.clubId) as [];

      const text = `[callScrapFussballdeMatchplan]  ${result.length} Spiele importiert.`;
      promises.push(sendToWebHook({ icon_emoji: ':clap:', text }));
      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Fussball.de Spielplan-Import',
        Variables: {
          text,
          title: 'Manueller Fussball.de Spielplan-Import'
        }
      }));
      await Promise.all(promises);
      return result;

    } catch (e) {
      const text = `[callScrapFussballdeMatchplan] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Fussball.de Spielplan-Import',
        Variables: {
          text,
          title: 'Fehler: Manueller Fussball.de Spielplan-Import'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      throw new functions.https.HttpsError('internal', text);
    }
  });

export const callScrapFussballdeMatchplan = _callScrapFussballdeMatchplan;

const _reqScrapFussballdeMatchplan = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 30 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    console.log('version 2.1');
    const promises = [];

    try {

      const config = await getConfig();

      const startDateParam = moment(config?.fussball.startDate) || moment();
      const endDateParam = startDateParam.clone().add(config?.fussball.endDateOffset, 'months').subtract('1', 'days');
      const importer = new FussballImporter();

      const result = await importer.import(startDateParam, endDateParam, config?.fussball.clubId) as [];

      const text = `[reqScrapFussballdeMatchplan]  ${result.length} Spiele importiert.`;
      promises.push(sendToWebHook({ icon_emoji: ':clap:', text }));
      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Fussball.de Spielplan-Import',
        Variables: {
          text,
          title: 'Manueller Fussball.de Spielplan-Import'
        }
      }));
      await Promise.all(promises);
      resp.status(200).send(result);

    } catch (e) {
      const text = `[reqScrapFussballdeMatchplan] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Fussball.de Spielplan-Import',
        Variables: {
          text,
          title: 'Fehler: Manueller Fussball.de Spielplan-Import'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      resp.status(500).send(text);
    }
  });

export const reqScrapFussballdeMatchplan = _reqScrapFussballdeMatchplan;
