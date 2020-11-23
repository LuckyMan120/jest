import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as db from '../db';
import { MailEngine } from '../shared/_classes/mail-engine';
import { DEFAULT_ADMIN_CONTACTS, MAILJET_TEMPLATES } from './../app/app-config';

const _callSendContactFormToEmail = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 25 })
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {

    const currentApp = await db.currentApplication();
    const mailList = currentApp.data()?.mailing.filter((mailing: any) => mailing.isActive && mailing.title === 'Administration');

    const msg = {
      Subject: data.subject,
      To: data.to,
      BCC: mailList ? mailList[0].emails : DEFAULT_ADMIN_CONTACTS,
      TemplateId: MAILJET_TEMPLATES.admin,
      Variables: {
        text: data.text,
        title: data.subject
      }
    };

    const p1 = admin.firestore().collection('contact-requests').doc().set(data);
    const p2 = new MailEngine().sendMail(msg);

    return Promise.all([p1, p2]);
  });

export const callSendContactFormToEmail = _callSendContactFormToEmail;
