import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getUserTitle } from './../app-functions';
import { initAlgolia } from './../app/algolia';
import { sendToWebHook } from './../app/slack.config';
import { createInfoMail } from './../shared/_classes/mail-engine';
import { NotificationEngine } from './../shared/_classes/notification-engine';
import { updateStatisticsCounter } from './../statistics';




export const onUserCreate = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 15 })
  .firestore.document('/users/{userId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {

    console.log('version 1.0');

    const promises = [];
    const user = snapshot.data() as User;

    if (!user) {
      return true;
    }

    const afterTitle = getUserTitle(user);

    const algolia = await initAlgolia();
    if (algolia) {
      const USER_INDEX = algolia.initIndex('users');
      promises.push(USER_INDEX.saveObject({ title: afterTitle, objectID: context.params.userId }));
    }

    // eslint-disable-next-line max-len
    promises.push(admin.firestore().collection('statistics').doc('latest-user').set({ title: afterTitle, id: context.params.userId }, { merge: true }));

    promises.push(
      createInfoMail('Admin-Mailer', {
        Subject: 'Neue Benutzeranmeldung',
        Variables: {
          text: `Der Benutzer ${getUserTitle(user as any)}  hat sich neu angemeldet.
            Der Benutzer kann sich erst anmelden, wenn ihm zusätzliche Rollen zugeordnet werden.
            Bitte wechsle in die Admin-Oberfläche und speichere seine / ihre Rollen.`,
          title: 'Neuer Benutzer'
        }
      })
    );

    promises.push(sendToWebHook({ icon_emoji: ':heart:', text: `Ein neuer Benutzer hat sich registriert: ${getUserTitle(user)}` }));
    promises.push(NotificationEngine.notifyNewUser(getUserTitle(user as any), 'Neue Benutzeranmeldung'));
    promises.push(updateStatisticsCounter('Benutzer', admin.firestore.FieldValue.increment(1)));

    return await Promise.all(promises);
  });
