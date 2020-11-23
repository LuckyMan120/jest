import * as admin from 'firebase-admin';
import { onUserAuthCreate } from '../../user/user-auth-create';
import { fun } from '../test.config';
fun.cleanup();

let wrapped: any;

describe('Name of the group', () => {

  const user1 = { uid: '123456', displayName: 'Thomas Handle' };
  const user2 = { uid: '2ter', displayName: 'JennyJen' };

  beforeAll(async () => {
    wrapped = fun.wrap(onUserAuthCreate);
    const p1 = wrapped(user1);
    const p2 = wrapped(user2);
    return await Promise.all([p1, p2]);
  });

  it('should always be true', async () => {
    expect(true).toBe(true);
  });

  it('should create a document for user 1', async () => {
    const doc = await admin.firestore().doc(`/users/${user1.uid}`).get();
    expect(doc.exists).toBe(true);
  });

  it('should create a document for user2', async () => {
    const doc = await admin.firestore().doc(`/users/${user2.uid}`).get();
    expect(doc.exists).toBe(true);
  });

  // user1 GodAdmin
  // user2 defaultRole

});
