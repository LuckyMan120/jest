import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { currentApplication } from './../db';
import { MailEngine } from './../shared/_classes/mail-engine';
import { NotificationEngine } from './../shared/_classes/notification-engine';
import { generatePlayerStats } from './player-functions';
moment.locale('de');

export const cronPlayerMonthStatistics = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 20 })
  .pubsub.schedule('0 0 1 * *')
  .timeZone('Europe/Berlin')
  .onRun(async () => {

    console.info('version 1.0');

    const currentApp = await currentApplication();
    const mailer = currentApp.data()?.mailing.filter((mailing: any) => mailing.isActive && mailing.title === 'Administration');

    try {

      const now = moment().subtract('1', 'month').format('MM.YYYY');

      await generatePlayerStats(now);
      await new MailEngine().sendReminderToAdmins(mailer[0].emails, 'Spieler-Statistik', 'Automatische Erstellung Spieler-Statistik', '', `[cronPlayerMonthStatistics] Die Spielerstatistik für den Monat ${now} wurde erstellt.`);
      await NotificationEngine.sendSlackNotification(`[cronPlayerMonthStatistics] Die Spielerstatistik für den Monat ${now} wurde erstellt.`);
      return `[cronPlayerMonthStatistics] Die Spielerstatistik für den Monat ${now} wurde erstellt.`;

    } catch (e) {

      await new MailEngine().sendReminderToAdmins(mailer[0].emails, 'Spieler-Statistik', 'Fehler: Automatische Erstellung der Spielerstatistik', '', `[cronPlayerMonthStatistics] Der folgende Fehler ist aufgetreten: ${e.message}`);
      await NotificationEngine.notifyAdminError(`[cronPlayerMonthStatistics] ${e.message}`);
      await NotificationEngine.sendSlackNotification(`[cronPlayerMonthStatistics] ${e.message}`);
      return e;

    }

  });
