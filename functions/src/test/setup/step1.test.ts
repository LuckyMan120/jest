/*import * as admin from 'firebase-admin';
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
  }); */

/* it('should create a document for user2', async () => {
  const doc = await admin.firestore().doc(`/users/${user2.uid}`).get();
  expect(doc.exists).toBe(true);
}); 

});*/
const firebase = require('@firebase/testing')
const admin = require('firebase-admin')

const projectId = 'sfw-test-db';
process.env.GCLOUD_PROJECT = projectId
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

let app = admin.initializeApp({ projectId })
let db = firebase.firestore(app)

/*
beforeAll(async () => {
  await firebase.clearFirestoreData({ projectId });

}); */

test("Testing Second Case with id", async () => {
  const testDoc = {
    id: '123',
    email: 'Thomas.handle@gmail.com'
  }


  const ref = db.collection('user').doc()
  await ref.set(testDoc);

  const copyRef = db.collection('statistics').doc('/latest-user')

  await new Promise((r) => setTimeout(r, 4000))

  const copyDoc = await copyRef.get();
  console.log();
  expect(copyDoc.data()).toHaveProperty('id', testDoc.id);
  //expect(copyDoc.data()).toHaveProperty('title', testDoc.email);

  //expect(copyDoc.data()).toStrictEqual(testDoc);


});

test("Testing Second Case with title", async () => {
  const testDoc = {
    id: '123',
    email: 'Thomas.handle@gmail.com'
  }


  const ref = db.collection('user').doc()
  await ref.set(testDoc);

  const copyRef = db.collection('statistics').doc('/latest-user')

  await new Promise((r) => setTimeout(r, 4000))

  const copyDoc = await copyRef.get();
  console.log();
  //expect(copyDoc.data()).toHaveProperty('id', testDoc.id);
  expect(copyDoc.data()).toHaveProperty('title', testDoc.email);

  //expect(copyDoc.data()).toStrictEqual(testDoc);


});

/*test("Testing One Case", async () => {
  const testDoc = {
    id: 123,
    email: 'Thomas.handle@gmail.com'
  }

  const ref = db.collection('user').doc()
  await ref.set(testDoc);

  const copyRef = db.collection('statistics').doc('/currentApplication')

  await new Promise((r) => setTimeout(r, 4000))

  const copyDoc = await copyRef.get();
  expect(copyDoc.data()).toHaveProperty('Benutzer', 1);

  let size: any;

  db.collection('user').get().then(snap => {
    size = snap.size // will return the collection size
  });*/


test("If user.collections.size > 0 set the user.isGodAdmin to true", async () => {
  const testDoc = {
    id: 123,
    email: 'Thomas.handle@gmail.com'
  }
  const UserData = {
    isGodAdmin: true,
  }

  const ref = db.collection('user').doc().get();
  if (Object.keys(ref).length == 0 && ref.id == 123) {
    const refUser = db.collection('user').doc()
    await refUser.set(UserData);
  }

  const ref_admin = db.collection('application').doc("/currentApplication");
  const ref_data = await ref_admin.get();

  await new Promise((r) => setTimeout(r, 4000))

  expect(ref_data.data()).toHaveProperty('adminUserId', testDoc.id);

});

test("OnUserDelete:Check, if the Benutzer-Counter from /statistics/currentApplication was decremented by 1", async () => {


  //const Benutzer = 1;
  const ref = db.collection('statistics').doc('currentApplication').get().data();
  const ref2 = ref.data();

  expect(ref2).toHaveProperty('Benutzer', 0);

});


test("OnUserUpdate", async () => {
  const testDoc = {
    authUser: false,
    email: 'Thomas.handle@gmail.com'
  }
  const UserData = {
    isGodAdmin: true,
  }

  const ref = db.collection('user').doc().get();
  if (Object.keys(ref).length == 0 && ref.id == 123) {
    const refUser = db.collection('user').doc()
    await refUser.set(UserData);
  }

  const ref_admin = db.collection('application').doc("/currentApplication");
  const ref_data = await ref_admin.get();

  await new Promise((r) => setTimeout(r, 4000))

  expect(ref_data.data()).toHaveProperty('adminUserId', testDoc.authUser);

});


/*const functions = require('functions/src/user/user-create.ts');
const test1 = require('firebase-functions-test')();
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn()
}))
describe('onUserCreate', () => {
  it('successfully invokes function', async () => {
    const wrapped = test1.wrap(functions.onUserCreate);
    // const data = { name: 'hello - world', broadcastAt: new Date() }
    await wrapped({
      data: () => ({
        name: 'hello - world'
      }),
      ref: {
        set: jest.fn()
      }
    })
  })
})
const mockQueryResponse = jest.fn()
mockQueryResponse.mockResolvedValue([
  {
    id: 1
  }
])

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: () => ({
   collection: jest.fn(path => ({
     where: jest.fn(queryString => ({
       get: mockQueryResponse
     }))
   }))
  })
}))*/
