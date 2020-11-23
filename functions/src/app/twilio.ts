import * as functions from 'firebase-functions';

export const TWILIO_ACCOUNT_SID = functions.config().twilio.sid;
export const TWILIO_AUTH_TOKEN = functions.config().twilio.token;
export const TWILIO_NUMBER = functions.config().twilio.number;

/* export const TWILIO_CLIENT = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN , {
  region: 'de1',
  edge: 'frankfurt'
}); */
