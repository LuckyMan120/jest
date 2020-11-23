
import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export * from './scrap-dfb-net-players';
export * from './scrap-dfb-net-players.cron';
export * from './scrap-fussball-de-matchplan';
export * from './scrap-fussball-de-matchplan.cron';
/* export * from './scrap-fussball-de-standings';
export * from './scrap-fussball-de-standings.cron'; */
export * from './scrap-google-drive-members';
export * from './scrap-google-drive-members.cron';

export const isUserAllowedToCallFn = async (userId: string | undefined, resp?: any): Promise<boolean> => {
  let userAllowed = false;
  try {
    userAllowed = await isUserAllowed(userId);
  } catch (e) {
    // eslint-disable-next-line max-len
    resp ?
      resp.status(403).send('you are not authorised to perform this action') :
      Promise.reject(new functions.https.HttpsError('permission-denied', 'you are not authorised to perform this action'));
  }
  if (!userAllowed) {
    resp ?
      resp.status(403).send('you are not authorised to perform this action') :
      Promise.reject(new functions.https.HttpsError('permission-denied', 'you are not authorised to perform this action'));
  }
  return userAllowed;
};

export const isUserAllowed = async (userId: string | undefined): Promise<boolean> => {
  let result = false;
  if (!userId) {
    return result;
  }
  try {
    const user = await admin.firestore().doc(`users/${userId}`).get();
    result = user.exists;
    result = result && (user.data() as User).assignedRoles.Administrator === true;
  } catch (e) {
    console.error('[isUserAllowed]', e);
    result = false;
  }
  return result;
};
