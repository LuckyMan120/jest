import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as moment from 'moment';
import { getMatchTitle, getTeamTitle, getUserTitle } from '../app-functions';
import { ALGOLIA_CLIENT } from '../app/algolia';
import { isUserAllowedToCallFn } from '../scraping/index';
import { NotificationEngine } from '../shared/_classes/notification-engine';
import { Match } from '../shared/_interfaces/match.interface';
import { Team } from '../shared/_interfaces/team.interface';
import { UserInterface } from '../shared/_interfaces/user.interface';
moment.locale('de');

export const getContent = (type: 'articles' | 'categories' | 'locations' | 'matches' | 'members' | 'players' | 'seniors' | 'teams' | 'users', data: any, id: string) => {
  switch (type) {
    case 'articles':
    case 'categories':
    case 'locations':
      return { title: data.title, objectID: id };
    case 'matches':
      return {
        title: getMatchTitle(data as Match),
        matchStartDate: moment(data.matchStartDate).format('DD.MM.YYYY HH:mm'),
        objectID: id
      };
    case 'members':
    case 'seniors':
    case 'players':
      return {
        firstName: data.firstName,
        lastName: data.lastName,
        title: getUserTitle(data as UserInterface),
        birthDate: data.birthDate,
        gerLocale: moment(data.birthDate).format('DD.MM.YYYY'),
        objectID: id
      };
    case 'teams':
      return { title: getTeamTitle(data as Team), objectID: id };
    case 'users':
      return { title: getUserTitle(data as UserInterface), objectID: id };
  }
};

const _callAlgoliaExport = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 20 })
  .https.onCall(async (data: any, context: CallableContext) => {
    console.info('version 1.0');

    isUserAllowedToCallFn(context.auth?.uid);

    try {

      const algoliaIndices = ['articles', 'categories', 'locations', 'matches', 'members', 'players', 'seniors', 'teams', 'users'];
      const collectionPromises = algoliaIndices.map(category => admin.firestore().collection(category).get());
      const collectionsData = await Promise.all(collectionPromises);

      const result = collectionsData.map((collection, idx) => {
        return { type: algoliaIndices[idx], data: collection.docs.map(doc => getContent(algoliaIndices[idx] as any, doc.data(), doc.id)) };
      });

      const promises = result.map((collection) => {
        const algoliaIndex = ALGOLIA_CLIENT.initIndex(collection.type);
        return algoliaIndex.saveObjects(collection.data);
      });
      await Promise.all(promises);

      return result;
    } catch (e) {
      NotificationEngine.notifyAdminError(`[callAlgoliaExport] ${e.message}`);
      NotificationEngine.sendSlackNotification(`[callAlgoliaExport] ${e.message}`);
      throw new functions.https.HttpsError('internal', `[callAlgoliaExport] ${e.message}`);
    }
  });

export const callAlgoliaExport = _callAlgoliaExport;


const _reqAlgoliaExport = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 20 })
  .https.onRequest(async (req: functions.https.Request, resp: functions.Response<any>) => {

    try {

      const algoliaIndices = ['articles', 'categories', 'locations', 'matches', 'members', 'players', 'seniors', 'teams', 'users'];
      const collectionPromises = algoliaIndices.map(category => admin.firestore().collection(category).get());
      const collectionsData = await Promise.all(collectionPromises);

      const result = collectionsData.map((collection, idx) => {
        return { type: algoliaIndices[idx], data: collection.docs.map(doc => getContent(algoliaIndices[idx] as any, doc.data(), doc.id)) };
      });

      const promises = result.map((collection) => {
        const algoliaIndex = ALGOLIA_CLIENT.initIndex(collection.type);
        return algoliaIndex.saveObjects(collection.data);
      });
      await Promise.all(promises);

      resp.status(200).send(result);
    } catch (e) {
      NotificationEngine.notifyAdminError(`[reqAlgoliaExport] ${e.message}`);
      NotificationEngine.sendSlackNotification(`[reqAlgoliaExport] ${e.message}`);
      resp.status(500).send(`[reqAlgoliaExport] ${e.message}`);
    }

  });

export const reqAlgoliaExport = _reqAlgoliaExport;
