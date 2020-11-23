import * as admin from 'firebase-admin';
import 'jest-extended';
import { fun } from '../test.config';
fun.cleanup();


describe('my functions', () => {
  let adminStub;
  let api;

  beforeAll(() => {
    adminStub = jest.spyOn(admin, 'initializeApp');
    api = require('../index');
  });

  afterAll(() => {
    adminStub.mockRestore();

    admin.firestore().collection(`users`).
      .ref('users')
      .remove();
  });

  it('should store new user in fs', async () => {
    const wrapped = fun.wrap(api.onUserCreate);

    const testUser1 = { uid: '123', displayName: 'Admin' };
    const testUser2 = { uid: '456', displayName: 'Guest' };

    await wrapped(testUser1);
    await wrapped(testUser2);

    // we read our user from database
    const createdUser1 = (await admin.firestore().doc(`/users/${testUser1.uid}`).get()).data();
    const createdUser2 = (await admin.firestore().doc(`/users/${testUser2.uid}`).get()).data();

    // we expect our newly created user to have zero points
    expect(createdUser1).toHaveProperty('points', 0);
  });
});
