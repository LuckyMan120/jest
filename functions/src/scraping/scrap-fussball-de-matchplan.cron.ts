import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { sendToWebHook } from './../app/slack.config';
import { getConfig } from './../db';
import { createInfoMail } from './../shared/_classes/mail-engine';
import { NotificationEngine } from './../shared/_classes/notification-engine';
import { FussballImporter } from './../shared/_classes/scraping/FussballImporter';
moment.locale('de');

const _cronScrapFussballdeMatchplan = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 30 })
  .pubsub.schedule('10 5 * * *') // Cron at 05:10.
  .timeZone('Europe/Berlin')
  .onRun(async context => {

    console.log('version 2.1');
    const promises = [];

    try {

      const config = await getConfig();

      const startDateParam = moment(config?.fussball.startDate) || moment();
      const endDateParam = moment().add(config?.fussball.endDateOffset, 'month');
      const importer = new FussballImporter();

      const result = await importer.import(startDateParam, endDateParam, config?.fussball.clubId) as [];

      const text = `[cronScrapFussballdeMatchplan]  ${result.length} Spiele importiert.`;
      promises.push(sendToWebHook({ icon_emoji: ':clap:', text }));
      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Fussball.de Spielplan-Import',
        Variables: {
          text,
          title: 'Automatischer Fussball.de Spielplan-Import'
        }
      }));
      await Promise.all(promises);
      return text;

    } catch (e) {
      const text = `[cronScrapFussballdeMatchplan] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Admin-Mailer', {
        Subject: 'Fussball.de Spielplan-Import',
        Variables: {
          text,
          title: 'Fehler: Automatischer Fussball.de Spielplan-Import'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      return e;
    }

  });

export const cronScrapFussballdeMatchplan = _cronScrapFussballdeMatchplan;

