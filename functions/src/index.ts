import { Match } from '@match/_interfaces/match.interface';
import { Team } from '@team/_interfaces/team.interface';
import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { getMatchTitle, getTeamTitle, getUserTitle } from './app-functions';
import { initAlgolia } from './app/algolia';

const DEBUG = true;

export const SERVICE_ACCOUNT = require('./../serviceAccounts/sf-wtb.json');

if (DEBUG) {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    databaseURL: 'https://sf-wtb.firebaseio.com',
    storageBucket: 'sf-wtb.appspot.com'
  });
} else {
  admin.initializeApp();
}

export const db = admin.firestore();

// export * from './article';
export * from './calendar';
export * from './category';
export * from './club';
export * from './location';
/* export * from './match';
export * from './media';*/
export * from './member';
/* export * from './newsletter'; */
export * from './others';
export * from './player';
export * from './role';
export * from './scraping';
export * from './senior';
/* export * from './social';
export * from './sponsor';
export * from './statistics';
export * from './team';
export * from './timeline';
*/
export * from './setup';
export * from './user';

/*
export const reqSetup = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    if (!req.query.adminId) {
      resp.status(500).send('adminId must be given as parameter');
      return;
    }

    const snap = await admin.firestore().collection(`categories`).get();
    await Promise.all(snap.docs.map(doc => doc.ref.delete()));

    const creation = {
      by: req.query.adminId as string,
      at: new Date().valueOf()
    };
    const pr = environment.appDefaults.categories.map(category => createCategories(category, creation));
    const categories = await Promise.all(pr);

    const pr2 = categories.map(category => setParentCategories(category));
    await Promise.all(pr2);

    resp.status(200).send(true);
    return;
  }); */

const _reqDeleteCollection = functions
  .region('europe-west1')
  .runWith({ memory: '1GB', timeoutSeconds: 10 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    console.log('version 2.1');

    if (!req.query.collection) {
      return resp.status(500).send('Collection must be given as parameter');
    }

    try {
      // delete stats also
      await admin.firestore().collection(`statistics`).doc(req.query.collection + `-statistics`).delete();

      const items = await admin.firestore().collection(req.query.collection as string).get();
      const promises = items.docs.map(doc => doc.ref.delete());
      await Promise.all(promises);
      resp.status(200).send('deleted');

    } catch (e) {
      return e.message;
    }
  });

export const reqDeleteCollection = _reqDeleteCollection;


const _reqAlgolia = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 25 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    console.log('version 2.1');
    const algolia = await initAlgolia();

    try {
      const types = ['categories', 'members', 'players', 'seniors', 'users', 'locations', 'teams'];

      const colPromises = types.map(c => admin.firestore().collection(c).get());
      const collections = await Promise.all(colPromises);
      const res = collections.map((col, idx) => {

        const type = types[idx];

        return {
          type, items: col.docs.map(doc => {

            const data = doc.data();

            let toSave: any;

            switch (type) {
              case 'articles':
              case 'categories':
              case 'locations':
                toSave = { title: data.title, objectID: doc.id };
                break;
              case 'matches':
                toSave = {
                  title: getMatchTitle(data as Match),
                  matchStartDate: moment(data.matchStartDate).format('DD.MM.YYYY HH:mm'),
                  objectID: doc.id
                };
                break;
              case 'members':
              case 'seniors':
              case 'players':
              case 'users':
                toSave = {
                  firstName: data.firstName,
                  lastName: data.lastName,
                  title: getUserTitle(data as User),
                  birthDate: data.birthDate,
                  gerLocale: moment(data.birthDate).format('DD.MM.YYYY'),
                  objectID: doc.id
                };
                break;
              case 'teams':
                toSave = { title: getTeamTitle(data as Team), objectID: doc.id };
                break;
            }
            return toSave;
          })
        };
      });

      const promises: any = res.map(entry => {
        if (algolia) {
          console.log(`Exporting type ${entry.type}`);
          const INDEX = algolia.initIndex(entry.type);
          return INDEX.saveObjects(entry.items);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);

      resp.status(200).send(res);

    } catch (e) {
      return e;
    }
  });

export const reqAlgolia = _reqAlgolia;
