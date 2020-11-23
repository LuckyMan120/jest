import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as moment from 'moment';
import { getBirthdayReminder } from '.';
import { isUserAllowedToCallFn } from '../scraping/index';
import { NotificationEngine } from '../shared/_classes/notification-engine';
moment.locale('de');

const _callSendBirthdayReminder = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 360 })
  .https.onCall(async (data: any, context: CallableContext) => {

    isUserAllowedToCallFn(context.auth?.uid);

    try {
      const sendReminders = await getBirthdayReminder();
      NotificationEngine.sendSlackNotification(`[callSendBirthdayReminder] ${sendReminders} Geburtstagserinnerungen wurden gesendet.`);

      return `[callSendBirthdayReminder] ${sendReminders} Geburtstagserinnerungen wurden gesendet.`;

    } catch (e) {

      NotificationEngine.notifyAdminError(`[callSendBirthdayReminder] ${e.message}`);
      NotificationEngine.sendSlackNotification(`[callSendBirthdayReminder] ${e.message}`);
      throw new functions.https.HttpsError('internal', `[callSendBirthdayReminder] ${e.message}`);

    }
  });

export const callSendBirthdayReminder = _callSendBirthdayReminder;

const _reqSendBirthdayReminder = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 360 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    try {

      const sendReminders = await getBirthdayReminder();
      NotificationEngine.sendSlackNotification(`[reqSendBirthdayReminder] ${sendReminders} Geburtstagserinnerungen wurden gesendet.`);
      resp.status(200).send(`[reqSendBirthdayReminder] ${sendReminders} Geburtstagserinnerungen wurden gesendet.`);

    } catch (e) {

      NotificationEngine.notifyAdminError(`[reqSendBirthdayReminder] ${e.message}`);
      NotificationEngine.sendSlackNotification(`[reqSendBirthdayReminder] ${e.message}`);
      resp.status(500).send(`[reqSendBirthdayReminder] ${e.message}`);

    }
  });
export const reqSendBirthdayReminder = _reqSendBirthdayReminder;
