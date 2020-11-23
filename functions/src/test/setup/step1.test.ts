import * as admin from 'firebase-admin';
import { firebaseConfig, fun } from '../test.config';
import { environment } from './../../../../src/environments/environment';
import { callSetupStep1, Step1Data } from './../../setup/setup-step1';
fun.cleanup;

let wrapped: any;
const data: Step1Data = environment.appDefaults;

const context = {
  auth: {
    uid: 'string',
    token: {
      aud: firebaseConfig.projectId,
      auth_time: Date.now(),
      exp: Date.now() + 1000000000,
      firebase: {
        identities: {
          user: {}
        },
        sign_in_provider: 'password',
      },
      uid: 'test-user'
    }
  }
};

describe('call setupStep1', () => {

  beforeAll(async () => {
    wrapped = fun.wrap(callSetupStep1);
    return await wrapped(data, context);
  });

  it('should always be true', async () => {
    expect(true).toBe(true);
  });

  it('should create all categories in the category-collection', async () => {
    const col = await admin.firestore().collection(`categories`).get();
    expect(col.size).toBe(data.categories.length);
  });

  /* it('should create a document for user2', async () => {
    const doc = await admin.firestore().doc(`/users/${user2.uid}`).get();
    expect(doc.exists).toBe(true);
  }); */

});
