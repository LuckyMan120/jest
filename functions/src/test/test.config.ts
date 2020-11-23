import * as admin from 'firebase-admin';
import * as testFunctions from 'firebase-functions-test';
import * as path from 'path';

admin.initializeApp();


export const firebaseConfig = {
  databaseURL: 'https://sf-wtb.firebaseio.com',
  projectId: 'sf-wtb',
  storageBucket: 'sf-wtb.appspot.com'
};

const envConfig = {};

const fun = testFunctions(firebaseConfig, path.join('.', './serviceAccounts/sf-wtb.json'));
fun.mockConfig(envConfig);

export { fun };

