import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';

export const exportToPDF = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .https.onCall(async (data: any, context: CallableContext) => {

    console.log('version 1.0');

    return data;

    /* try {

      await isUserAllowedToCallFn(context.auth?.uid);

      // gets the documents from the firestore collection
      const applicationsSnapshot = await admin.firestore().collection('applications').get();

      const applications = applicationsSnapshot.docs.map(doc => doc.data());

      // csv field headers
      const fields = ['firstName', 'lastName',];

      // get csv output
      const output = await parseAsync(applications, { fields });

      // generate filename
      const dateTime = new Date().toISOString().replace(/\W/g, '');
      const filename = `applications_${dateTime}.csv`;

      const tempLocalFile = path.join(os.tmpdir(), filename);

      return new Promise((resolve, reject) => {
        // write contents of csv into the temp file
        fs.writeFile(tempLocalFile, output, error => {
          if (error) {
            reject(error);
            return;
          }
          const bucket = firebase.storage().bucket();

          // upload the file into the current firebase project default bucket
          bucket
            .upload(tempLocalFile, {
              // Workaround: firebase console not generating token for files
              // uploaded via Firebase Admin SDK
              // https://github.com/firebase/firebase-admin-node/issues/694
              metadata: {
                metadata: {
                  firebaseStorageDownloadTokens: uuidv4(),
                }
              },
            })
            .then(() => resolve())
            .catch(errorr => reject(errorr));
        });
      });
    } */

  });
