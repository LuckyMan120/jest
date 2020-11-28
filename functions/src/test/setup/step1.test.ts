const firebase = require('@firebase/testing');
const admin = require('firebase-admin');

import * as testFunctions from 'firebase-functions-test';
import * as path from 'path';
//import { fun } from "../test.config";
let api = require('functions/src/user/index');

const projectId = 'sfw-test-db';
process.env.GCLOUD_PROJECT = projectId;
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

let app = admin.initializeApp({ projectId });
let db = firebase.firestore(app);

const firebaseConfig = {
  databaseURL: 'https://sfw-test-db.firebaseio.com',
  projectId: 'sfw-test-db',
  storageBucket: 'sfw-test-db.appspot.com'
};

const envConfig = {};

const fun = testFunctions(firebaseConfig, path.join('.', './serviceAccounts/service_acc.json'));
fun.mockConfig(envConfig);

beforeAll(async () => {
  await firebase.clearFirestoreData({ projectId });
});

test("Testing Second Case with id", async () => {


  // const copyRef = db.collection('statistics').doc('/latest-user')

  expect(true).toBe(true);


});


test("Testing Second Case with id", async () => {
  const testDoc = {
    id: '123',
    email: 'Thomas.handle@gmail.com'
  }

  //const wrapped = fun.wrap(api.onUserCreate);
  //await wrapped(testDoc)

  const userid = db.collection('user').doc('/${testDoc.id}').get().data();

  await new Promise((r) => setTimeout(r, 4000));

  expect(userid).toHaveProperty('id', testDoc.id);

});