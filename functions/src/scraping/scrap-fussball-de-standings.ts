import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { NotificationEngine } from './../shared/_classes/notification-engine';
import { FussballImporter } from './../shared/_classes/scraping/FussballImporter';
import { isUserAllowedToCallFn } from './index';

const _callScrapStandings = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 360 })
  .https.onCall(async (data: any, context: CallableContext) => {

    console.info('version 2.0');

    await isUserAllowedToCallFn(context.auth?.uid);

    try {
      const importer = new FussballImporter();
      return await importer.importStandings();
    } catch (e) {
      await NotificationEngine.notifyAdminError(e);
      await NotificationEngine.sendSlackNotification(e);
      throw new functions.https.HttpsError('internal', e);
    }
  });

export const callScrapStandings = _callScrapStandings;

const _reqScrapStandings = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 360 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    console.info('version 2.0');

    try {
      const result = await new FussballImporter().importStandings();
      resp.status(200).send(result);
    } catch (e) {
      await NotificationEngine.notifyAdminError(e);
      await NotificationEngine.sendSlackNotification(e);
      resp.status(500).send(e);
      console.log(e);
    }
  });

export const reqScrapStandings = _reqScrapStandings;
