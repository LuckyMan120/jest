import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as moment from 'moment';
import { currentApplication } from './../db';
import { isUserAllowedToCallFn } from './../scraping/index';
import { MailEngine } from './../shared/_classes/mail-engine';
import { NotificationEngine } from './../shared/_classes/notification-engine';
import { generatePlayerStats } from './player-functions';
moment.locale('de');

const _callPlayerMonthStatistics = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 360 })
  .https.onCall(async (data: any, context: CallableContext) => {

    await isUserAllowedToCallFn(context.auth?.uid);

    console.info('version 1.0');

    const currentApp = await currentApplication();
    const mailer = currentApp.data()?.mailing.filter((mailing: any) => mailing.isActive && mailing.title === 'Administration');

    try {

      const now = moment().subtract('1', 'month').format('MM.YYYY');

      await generatePlayerStats(now);
      new MailEngine().sendReminderToAdmins(mailer[0].emails, 'Spieler-Statistik', 'Manuelle Erstellung Spieler-Statistik', '', `[reqPlayerStatistics] Die Spielerstatistik für den Monat ${now} wurde erstellt.`);
      NotificationEngine.sendSlackNotification(`[reqPlayerStatistics] Die Spielerstatistik für den Monat ${now} wurde erstellt.`);

      return `[callPlayerStatistics] Die Spielerstatistik für den Monat ${now} wurde erstellt.`;

    } catch (e) {

      NotificationEngine.notifyAdminError(`[callPlayerStatistics] ${e.message}`);
      NotificationEngine.sendSlackNotification(`[callPlayerStatistics] ${e.message}`);
      throw new functions.https.HttpsError('internal', `[callPlayerStatistics] ${e.message}`);

    }
  });

export const callPlayerMonthStatistics = _callPlayerMonthStatistics;

const _reqPlayerMonthStatistics = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 360 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    console.info('version 1.0');

    // const currentApp = await currentApplication();
    // const mailer = currentApp.data()?.mailing.filter((mailing: any) => mailing.isActive && mailing.title === 'Administration');

    try {

      const now = moment().subtract('1', 'month').format('MM.YYYY');

      const stats = await generatePlayerStats(now, !!req.query.force);
      // await sendReminderToAdmins(
      // mailer[0].emails, 'Spieler-Statistik', 'Manuelle Erstellung Spieler-Statistik', '',
      // `[reqPlayerStatistics] Die Spielerstatistik für den Monat ${now} wurde erstellt.`);
      // NotificationEngine.sendSlackNotification(`[reqPlayerStatistics] Die Spielerstatistik für den Monat ${now} wurde erstellt.`);
      resp.status(200).send(stats);

    } catch (e) {

      NotificationEngine.notifyAdminError(`[reqPlayerStatistics] ${e.message}`);
      NotificationEngine.sendSlackNotification(`[reqPlayerStatistics] ${e.message}`);
      resp.status(500).send(`[reqPlayerStatistics] ${e.message}`);

    }
  });
export const reqPlayerMonthStatistics = _reqPlayerMonthStatistics;
