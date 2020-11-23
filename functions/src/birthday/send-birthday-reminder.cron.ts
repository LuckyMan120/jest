import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { getBirthdayReminder } from '.';
import { NotificationEngine } from '../shared/_classes/notification-engine';
import { sendToWebHook } from './../app/slack.config';
import { createInfoMail } from './../shared/_classes/mail-engine';
moment.locale('de');

const _cronBirthdayReminder = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 30 })
  .pubsub.schedule('15 5 * * *') // Cron at 5:15.
  .timeZone('Europe/Berlin')
  .onRun(async () => {

    console.log('version 2.1');
    const promises = [];

    try {

      const sendReminders = await getBirthdayReminder();

      const text = `[cronBirthdayReminder] ${sendReminders} Geburtstagserinnerungen wurden gesendet.`;
      promises.push(sendToWebHook({ icon_emoji: ':alarm_clock:', text }));

      promises.push(createInfoMail('Geburtstagsgrüße', {
        Subject: 'Geburtstagserinnerungen',
        Variables: {
          text,
          title: 'Automatische Geburtstagserinnerungen per E-Mail'
        }
      }));
      await Promise.all(promises);
      return text;

    } catch (e) {
      const text = `[cronScrapDFBnetPlayers] Der folgende Fehler ist aufgetreten: ${e.message}`;

      promises.push(createInfoMail('Geburtstagsgrüße', {
        Subject: 'Geburtstagserinnerungen',
        Variables: {
          text,
          title: 'Fehler: Automatische Geburtstagserinnerungen per E-Mail'
        }
      }));
      promises.push(NotificationEngine.notifyAdminError(text));
      promises.push(sendToWebHook({ icon_emoji: ':boom:', text }));
      throw new functions.https.HttpsError('internal', text);

    }

  });

export const cronBirthdayReminder = _cronBirthdayReminder;
