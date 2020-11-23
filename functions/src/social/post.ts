import * as functions from 'firebase-functions';
import { SocialPostData } from '../shared/_interfaces/social-post-data.interface';
import { postSocialMessage as fbMessage } from './facebook.helper';
import { postSocialMessage as twitterMessage } from './twitter.helper';

export const callSocialMessage = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 25 })
  .https.onCall(async (data: SocialPostData, context) => {

    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }


    // Checking attribute.
    if (!!!data || !!!data.message || !!!data.type) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('invalid-argument', 'Invalid arguments');
    }

    // if request is asked for facebook
    if (data.type === 'facebook') {

      // Checking attribute for facebook API.
      if (!!!data.userAccessToken) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('invalid-argument', 'Invalid arguments');
      }

      const result = await fbMessage(data);
      return result;


    } else if (data.type === 'twitter') {

      const result = await twitterMessage(data);
      return result;
    }


    throw new functions.https.HttpsError('unimplemented', 'Function not yet implemented.');

  });
