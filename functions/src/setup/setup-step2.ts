import { Calendar } from '@application/_interfaces/calendar.interface';
import { MailList } from '@application/_interfaces/mail-list.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';


export interface Step2Data {
  assignedCalendars: Calendar[];
  assignedLinks: any[];
  creation: {
    at: number;
  };
  downtime: {
    isEnabled: boolean;
    message: string;
  };
  id: string;
  mailing: MailList[];
  page: {
    assignedKeywords: string;
    author: string;
    backendUrl: string;
    description: string;
    email: string;
    frontendUrl: string;
    subTitle: string;
    title: string;
  };
  registration: {
    defaultRole: string;
    enabled: boolean;
  };
}

const setCategoryId = async (mailList: MailList): Promise<MailList> => {
  const pr = await admin.firestore().collection(`categories`).where('title', '==', mailList.assignedCategoryTitle).get();
  mailList.assignedCategoryId = (pr && pr.size > 0) ? pr.docs[0].id : '';
  return mailList;
};

const setupStep2 = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .https.onCall(async (data: { form: Step2Data, rolesToPermissions: any }, context: CallableContext) => {

    console.log('version 1.2');

    try {
      const existingApp = await admin.firestore().doc(`applications/currentApplication`).get();

      if (existingApp.exists) {
        throw new functions.https.HttpsError('already-exists', 'install.step2.already-exists');
      }

      const entries = Object.values(data.rolesToPermissions);

      const rolePromises = entries.map((value: { roleId: string, assignedPermissions: string[] }) =>
        admin.firestore().doc(`roles/${value.roleId}`).set({ assignedPermissions: value.assignedPermissions }, { merge: true })
      );

      // set the assignedCategoryIds as we sent the titles only
      const mailListPromises = data.form.mailing.map(mailList => setCategoryId(mailList));
      const mailing = await Promise.all(mailListPromises);

      const extendedData: Step2Data = {
        ...data.form,
        mailing,
        assignedLinks: [],
        creation: { at: new Date().valueOf() },
        downtime: { isEnabled: false, message: '' },
        id: 'currentApplication'
      };

      const appPromise = admin.firestore().doc(`applications/currentApplication`).set(extendedData);

      await Promise.all([...rolePromises, appPromise]);
      return { success: true };

    } catch (e) {
      return e;
    }
  });

export const callSetupStep2 = setupStep2;
