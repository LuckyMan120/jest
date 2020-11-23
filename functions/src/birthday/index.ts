import * as admin from 'firebase-admin';
// import { validE164 } from './../app/algolia';
import * as moment from 'moment';
// import { currentApplication } from '../db';
import { Birthday } from '../shared/_classes/birthday.class';
import { NotificationEngine } from '../shared/_classes/notification-engine';
import { BirthdayMember } from '../shared/_interfaces/birthday-member.interface';
import { createInfoMail, sendBirthdayMailToMember } from './../shared/_classes/mail-engine';
moment.locale('de');

export * from './send-birthday-reminder';
export * from './send-birthday-reminder.cron';

export const getBirthdayReminder = async (): Promise<any> => {

  let sendMails = 0;
  const birthday = new Birthday();
  const today = moment().format('MM-DD');

  const profileTypes: string[] = ['players', 'seniors', 'members'];

  const promises = profileTypes.map((type: string) => admin.firestore().collection(type).where('birthMonthDay', '==', today).get());

  const promiseResult = await Promise.all(promises);

  const docArrays = promiseResult.filter(entry => entry.docs.map(doc => {
    const age = birthday.calculateAge(moment(doc.data().birthDate));
    const email = doc.data().email ? `(${doc.data().email})` : '';

    if (email) {
      sendMails++;
      sendBirthdayMailToMember('Geburtstage', { ...doc.data() as BirthdayMember, age: age + 'sten' });
    }

    return `<li>${doc.data().firstName} ${doc.data().lastName} wird heute ${age} Jahre ${email} </li>`;
  }));

  const mergedData = [].concat(...docArrays);
  const uniqueData = [...new Set(mergedData)];

  let text = '';
  if (uniqueData.length > 0) {
    text = text + '<ul>';
    text = text + uniqueData.map(entry => entry);
    text = text + '</ul>';
    // sendWhatsappBirthdayReminderToAdmins(birthdayMailing[0].phoneNumbers, whatsappMessage);

    createInfoMail('Geburtstagsgrüße', {
      Subject: 'Geburtstage vom ' + moment().format('LL'),
      Variables: {
        // eslint-disable-next-line max-len
        intro: `Heute haben die folgende Mitglieder Geburtstag. Eine E-Mail wurde versendet, sofern das Mitglied eine E- Mail Adresse hinterlegt hat.`,
        text,
        title: 'Heutige Geburtstagskinder'
      }
    });
    NotificationEngine.notifyBirthdays(text, 'Reminder sent', false);
    NotificationEngine.sendSlackNotification(text.replace(/<\/?[^>]+(>|$)/g, ''));
  } else {
    text = `Keine Geburtstage für heute (${moment().format('DD.MM.')}) gefunden`;
    createInfoMail('Geburtstagsgrüße', {
      Subject: 'Geburtstage vom ' + moment().format('LL'),
      Variables: {
        text,
        title: 'Heutige Geburtstagskinder'
      }
    });
    NotificationEngine.notifyNoBirthdays(text, false);
    NotificationEngine.sendSlackNotification(text);
  }
  return sendMails;

};

/*
export const sendWhatsappBirthdayReminderToAdmins = async (phoneNumbers: string[], messageBody: string): Promise<any> => {
  if (!phoneNumbers || phoneNumbers.length === 0) {
    return true;
  }
  const promisses: Promise<any>[] = [];

  for (const phoneNumber of phoneNumbers) {
    promisses.push(sendToTwilio(phoneNumber, messageBody));
  }

  try {
    return await Promise.all(promisses).then((results: any[]) => {
      for (const res of results) {
        console.log(res.sid);
      }
      return results.map(res => res.sid);
    }).catch(e => console.log(e.message));
  } catch (e) {
    NotificationEngine.notifySystemError(e, 'Twilio Error');
    return e;
  }
};

export const sendToTwilio = (to: string, body: string) => {

  if (!validE164(to)) {
    throw new Error('number must be E164 format!')
  }
  console.log(body);
  return Promise.resolve();
  /* return TWILIO_CLIENT.messages
    .create({
      from: 'whatsapp:' + TWILIO_NUMBER,
      to: 'whatsapp:' + to,
      body
    });
}; */
