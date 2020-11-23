import { Config } from '@shared/_interfaces/config.interface';
import { User } from '@user/_interfaces/user.interface';
import { db } from './index';

export const currentApplication = () => {
  return db.collection('applications').doc(`currentApplication`).get();
};

export const getConfig = async (): Promise<Config> => {
  return (await db.doc('config/1').get()).data() as Config;
};

export const getDefaultAdmin = async (userId?: string): Promise<User | undefined> => {
  const app = await currentApplication();
  const adminId = app.data().adminUserId;
  return userId ?
    (await db.doc(`users/${userId}`).get()).data() as User :
    adminId ? (await db.doc(`users/${adminId}`).get()).data() as User :
      undefined;
};

export const getMailList = async (title: string): Promise<{ isActive: boolean, title: string; emails: string[] }[]> => {
  const currentApp = await currentApplication();
  return currentApp.data()?.mailing.find((mailing: any) => mailing.isActive && mailing.title === title);
};
