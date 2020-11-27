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
  });

  it('should store new user in fs', async () => {
    const wrapped = fun.wrap(api.onUserCreate);

    const testUser1 = { uid: '123', displayName: 'Admin' };
    const testUser2 = { uid: '456', displayName: 'Guest' };

    await wrapped(testUser1);
    await wrapped(testUser2);

    // we read our user from database
    const createdUser1 = (await admin.firestore().doc(`/users/${testUser1.uid}`).get()).data();
    console.log('Testing - ' + createdUser1);

    // we expect our newly created user to have zero points
    expect(createdUser1).toHaveProperty('points', 0);
  });

  it('should id=123 and title=Thomas.handle@gmail.com', async () => {
    const wrapped = fun.wrap(api.onUserCreate);

    const testUser1 = { uid: '123', email: 'Thomas.handle@gmail.com' };

    await wrapped(testUser1);

    // we read our user from database
    const userid = (await admin.firestore().doc(`/users/${testUser1.uid}`).get()).data();
    const useremail = (await admin.firestore().doc(`/users/${testUser1.email}`).get()).data();

    // we expect user id == 123 and title == 'Thomas.handle@gmail.com'
    expect(userid).toBe(123);
    expect(useremail).toBe('Thomas.handle@gmail.com');
  });


});
