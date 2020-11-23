import { Storage } from '@google-cloud/storage';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as fs from 'fs';
import * as json2csv from 'json2csv';
import * as moment from 'moment';
import * as os from 'os';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { sendToWebHook } from '../app/slack.config';
import { createInfoMail } from '../shared/_classes/mail-engine';
moment.locale('de');

export const exportToCSV = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 3 })
  .https.onCall(async (data: any, context: CallableContext) => {

    console.log('version 1.0');
    console.log(data);

    try {

      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + 180);

      const snapshot = await admin.firestore().collection(data.collection).get();

      const items = snapshot.docs.map(doc => doc.data());

      const output = json2csv.parse(items, data.fields);

      const dateTime = moment().format('YYYY-MM-DD_hh:mm');
      const filename = `${data.collection}_${dateTime}.xls`;

      const tempLocalFile = path.join(os.tmpdir(), filename);

      const storage = new Storage({
        projectId: process.env.GCP_PROJECT,
        keyFilename: './serviceAccounts/sf-wtb.json'
      });

      await fs.promises.writeFile(tempLocalFile, output);

      const newFile = await storage.bucket(admin.storage().bucket().name).upload(tempLocalFile, {
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          }
        },
      });

      return newFile[0].getSignedUrl({
        expires,
        action: 'read',
      });

    } catch (e) {

      const text = `[exportToCSV] Der folgende Fehler ist aufgetreten: ${e.message}`;

      createInfoMail('Admin-Mailer', {
        Subject: 'Datenbankexport',
        Variables: {
          text,
          title: `Fehler: Datenbankexport der Tabelle ${data.collection} fehlgeschlagen`
        }
      });
      // promises.push(NotificationEngine.notifyAdminError(text));
      sendToWebHook({ icon_emoji: ':boom:', text });
      throw new functions.https.HttpsError('internal', text);
    }

  });
