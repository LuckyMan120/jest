/* import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { DEFAULT_ADMIN_CONTACTS, MAILJET_TEMPLATES } from '../app/app-config';
import { currentApplication, getConfig } from '../db';
import { GoogleCalendar } from '../shared/_classes/googleCalendarClass';
import { MailEngine } from '../shared/_classes/mail-engine';
import { NotificationEngine } from '../shared/_classes/notification-engine';

const _cronGoogleCalendarExport = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 120 })
  .pubsub.schedule('30 14 * * *') // Cron at 14:30
  .timeZone('Europe/Berlin')
  .onRun(async context => {
    console.info('version 1.0');

    const currentApp = await currentApplication();
    const mailer = currentApp.data()?.mailing.filter((mailing: any) => mailing.isActive && mailing.title === 'Administration');

    try {

      const counter = {
        newMatches: 0,
        updatedMatches: 0
      };

      const matchplanCalendar = currentApp.data()?.assignedCalendars.filter((calendar: any) =>
      calendar.isActive && calendar.title === 'Spielplan'
      );

      if (matchplanCalendar.length !== 1 || !matchplanCalendar[0].link) {
        console.log('Kein Spielplan-Kalender gefunden.');
      }

      const config = await getConfig();
      const startDateParam = moment(config.fussballdeStartDate);
      const endDateParam = moment(startDateParam).add(config.fussballdeEndDateOffset, 'month');

      const matches = await admin.firestore().collection('matches')
        .where('matchStartDate', '>=', startDateParam.valueOf())
        .where('matchStartDate', '<=', endDateParam.valueOf()).get();
      console.log(matches.size + ' Spiele gefunden.');

      const calApi = GoogleCalendar.getApi();
      console.log(calApi);

      const matchList = matches.docs.map(doc => {
        const match = doc.data();
        return {
          id: match.googleCalendarId,
          summary: `${match.playersType}: ${match.homeTeam.title} - ${match.guestTeam.title}`,
          description: `Art: ${match.matchType}, Link: ${match.matchLink}`,
          start: {
            dateTime: new Date(match.matchStartDate),
            timeZone: 'Europe/Berlin',
          },
          end: {
            dateTime: new Date(match.matchEndDate),
            timeZone: 'Europe/Berlin',
          },
          location: match.location,
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 60 },
              { method: 'popup', minutes: 10 },
            ],
          }
        };
      });

      console.log(matchList);
      /* const matchPromises = matchList.map(match => GoogleCalendar.createEvent(calApi, matchplanCalendar[0].link, match));

      const dbPromises =
        /* const googleEvent = await GoogleCalendar.createEvent(calApi, matchplanCalendar[0].link, event);
        await doc.ref.set({ googleCalendarId: googleEvent.data.id }, { merge: true });

        match.googleCalendarId === googleEvent.data.id ? counter.updatedMatches++ : counter.newMatches++; //


      NotificationEngine.sendSlackNotification(`[cronCalendarExport] Der Spielplan-Kalender wurde
      exportiert (${counter.updatedMatches} geänderte, ${counter.newMatches} neue Spiele)`);
      return `[cronCalendarExport] Der Spielplan-Kalender wurde exportiert
      (${counter.updatedMatches} geänderte, ${counter.newMatches} neue Spiele)`;

    } catch (e) {

      NotificationEngine.sendSlackNotification(`[cronScrapStandings] ${e.message}`);

      const mailEngine = new MailEngine();
      mailEngine.sendMail({
        Subject: `Fehler in Cronjob 'cronCalendarExport'`,
        to: mailer[0].emails || DEFAULT_ADMIN_CONTACTS,
        TemplateId: MAILJET_TEMPLATES.admin,
        Variables: {
          intro: 'Hallo Admins', text: `Im Cronjob 'cronCalendarExport'
          ist folgender Fehler aufgetreten ${e}`, title: 'Fehler in Cronjob :/'
        }
      });
      return e;

    }


  });

export const cronGoogleCalendarExport = _cronGoogleCalendarExport; */
