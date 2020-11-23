import { Calendar } from '@application/_interfaces/calendar.interface';
import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { sendToWebHook } from './../app/slack.config';
import { isUserAllowedToCallFn } from './../scraping/index';
import { GoogleCalendar } from './../shared/_classes/googleCalendarClass';
import { createInfoMail } from './../shared/_classes/mail-engine';
import { NotificationEngine } from './../shared/_classes/notification-engine';

export const callGetGoogleCalendarEvents = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 8 })
  .https.onCall(async (data: { options: Calendar[] }, context: CallableContext) => {

    console.log('version 1.0');

    try {
      await isUserAllowedToCallFn(context.auth?.uid);

      const gCal = new GoogleCalendar();
      const calendarAPI = await gCal.getApi();

      const promises = data.options.map(cal => gCal.getEvents(calendarAPI, {
        calendarId: cal.calendarId,
        timeZone: 'Europe/Berlin',
        timeMin: cal.timeMin,
        timeMax: cal.timeMax,
        maxResults: cal.maxResults,
        singleEvents: cal.singleEvents || true
      }));
      const resultList = await Promise.all(promises);
      const items = resultList.map(result => result.data.items).flat(1);
      return items;

    } catch (e) {

      const text = `[callGetGoogleCalendarEvents] Der folgende Fehler ist aufgetreten: ${e.message}`;

      createInfoMail('Admin-Mailer', {
        Subject: 'Termine laden',
        Variables: {
          text,
          title: 'Fehler: Laden von Terminen aus Google-Kalendern'
        }
      });
      NotificationEngine.notifyAdminError(text);
      sendToWebHook({ icon_emoji: ':boom:', text });
      throw new functions.https.HttpsError('internal', text);

    }

  });
