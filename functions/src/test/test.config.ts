//import * as admin from 'firebase-admin';
import * as testFunctions from 'firebase-functions-test';
import * as path from 'path';

/*admin.initializeApp( {
  databaseURL: 'https://sfw-test-db.firebaseio.com',
}); */


export const firebaseConfig = {
  databaseURL: 'https://sfw-test-db.firebaseio.com',
  projectId: 'sfw-test-db',
  storageBucket: 'sfw-test-db.appspot.com'
};

const envConfig = {};

const fun = testFunctions(firebaseConfig, path.join('.', './serviceAccounts/service_acc.json'));
fun.mockConfig(envConfig);

export { fun };

