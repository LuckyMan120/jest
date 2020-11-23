import { MailList } from '@application/_interfaces/mail-list.interface';
import { birthdayWishes } from '../../birthday/birthday-wishes.config';
import * as db from '../../db';
import { DEFAULT_ADMIN_CONTACTS, MAILJET_TEMPLATES } from './../../app/app-config';
import { getConfig } from './../../db';
import { BirthdayMember } from './../_interfaces/birthday-member.interface';

export const getMailList = async (mailListTitle: string): Promise<MailList | undefined> => {
  const currentApp = await db.currentApplication();
  if (!currentApp.exists) {
    return undefined;
  }

  return currentApp.data()?.mailing.find((mailing: MailList) => mailing.isActive && mailing.assignedCategoryTitle === mailListTitle);
};

export const createInfoMail = async (mailListTitle: string, message: any) => {
  if (!('TemplateId' in message)) {
    message.TemplateId = MAILJET_TEMPLATES.admin;
  }
  message.to = DEFAULT_ADMIN_CONTACTS;
  /* const mailList = await getMailList(mailListTitle);
  if (mailList) {
    // ToDO: Instead of creating a fake name set correct names here and in admin interface
    const mailListWithNames = mailList.emails.map(email => ({ Email: email, Name: 'SFW Admin' }));
    message.to = mailListWithNames || DEFAULT_ADMIN_CONTACTS;
  } */
  return sendMail(message);

};

export const sendMail = async (data: any): Promise<any> => {
  const cfg = await getConfig();
  if (cfg && cfg.mailjet && cfg.mailjet.key && cfg.mailjet.secret) {
    const mailjet = require('node-mailjet').connect(cfg.mailjet.key, cfg.mailjet.secret);
    return mailjet.post('send', { version: 'v3.1' }).request({ Messages: [{ ...data, TemplateLanguage: true }] });
  }
};


export const sendBirthdayMailToMember = async (mailListTitle: string, member: BirthdayMember): Promise<void> => {
  const mailList = await getMailList(mailListTitle);
  const birthdaySample = birthdayWishes[Math.floor(Math.random() * birthdayWishes.length)];
  const message: any = {
    Subject: 'Alles Gute zum Geburtstag!',
    To: [{ Email: member.email, Name: `${member.firstName} ${member.lastName}` }],
    TemplateId: MAILJET_TEMPLATES.birthday,

    Variables: {
      title: 'Herzlichen Glückwunsch!',
      firstName: member.firstName,
      lastName: member.lastName,
      age: member.age,
      message: birthdaySample.message,
      author: birthdaySample.author
    }
  };
  message.bcc = mailList || DEFAULT_ADMIN_CONTACTS;
  return sendMail(message);
};

