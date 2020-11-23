import { Category } from '@category/_interfaces/category.interface';
import { WriteResult } from '@google-cloud/firestore';
import { Permission } from '@permission/_interfaces/permission.interface';
import { Role } from '@role/_interfaces/role.interface';
import { Creation } from '@shared/_interfaces/creation.interface';
import { Publication } from '@shared/_interfaces/publication.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';

require('cors')({ origin: true });

export interface Step1Data {
  algolia: {
    id: string;
    key: string
  };
  categories: Category[];
  communities: string[];
  dfbnet: {
    username: string;
    password: string;
  };
  fussball: {
    clubId: string;
    endDateOffset: number;
    startDate: number | undefined;
  };
  id?: number;
  mailjet: {
    key: string;
    secret: string;
  };
  memberSheetId: string;
  permissions: Permission[];
  roles: Role[];
  slackWebHookUrl: string;
  site: {
    author: string;
    backendUrl: string;
    description: string;
    frontendUrl: string;
    email: string;
    keywords: string;
    logo: string;
    subTitle: string;
    title: string;
  };
  uppy: {
    companionUrl: string;
    facebook?: boolean;
    instagram?: boolean;
    googleDrive?: boolean;
    oneDrive?: boolean;
    zoom?: boolean;
    dropbox?: boolean;
    url?: boolean;
  };
}

const setParentCategories = async (category: Category): Promise<WriteResult> => {
  if (category.assignedCategoryTitles) {
    const pr = category.assignedCategoryTitles.map((title: string) =>
      admin.firestore().collection(`categories`).where('title', '==', title).get()
    );
    const data = await Promise.all(pr);
    category.assignedCategoryIds = data.map((entry: any) => entry.docs.map((doc: any) => doc.id)).flat(1);
  }
  return admin.firestore().collection(`categories`).doc(category.id).set(category, { merge: true });
};

const createCategories = async (category: Category, creation: Creation, publication: Publication): Promise<Category> => {
  const existingDocs = await admin.firestore().collection(`categories`).where('title', '==', category.title).get();
  if (existingDocs.size === 0) {
    category.assignedCategoryIds = [];
    category.creation = creation;
    category.publication = publication;
    category.isImported = true;
    category.isCoreCategory = true;
    category.id = admin.firestore().collection(`categories`).doc().id;
    await admin.firestore().collection(`categories`).doc(category.id).set(category);
    return category;
  } else {
    return existingDocs.docs[0].data() as Category;
  }
};

const setupStep1 = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 10 })
  .https.onCall(async (data: Step1Data, context: CallableContext) => {

    console.log('version 1.0');

    try {

      const existingConfig = await admin.firestore().doc(`config/1`).get();
      const existingApp = await admin.firestore().doc(`applications/currentApplication`).get();

      const promises = await Promise.all([existingConfig, existingApp]);
      const anyExistingData = promises.find(p => p.exists);

      if (anyExistingData) {
        throw new functions.https.HttpsError('already-exists', 'install.step1.already-exists');
      }

      // create categories and set their parentIds
      const creation: Creation = { at: new Date().valueOf(), by: 'System-Installer' };
      const publication: Publication = { at: new Date().valueOf(), status: 1, by: 'System-Installer' };
      const pr = data.categories.map(category => createCategories(category, creation, publication));
      const categories = await Promise.all(pr);
      const categoryPromises = categories.map(category => setParentCategories(category));

      const rolePromises = data.roles.map((role: Role) => {
        const id = admin.firestore().collection(`roles`).doc().id;
        return admin.firestore().doc(`roles/${id}`).set({ ...role, id, assignedUserIds: [] }, { merge: true });
      });

      const permissionsPromises = data.permissions.map((permission: Permission) => {
        const id = admin.firestore().collection(`permissions`).doc().id;
        return admin.firestore().doc(`permissions/${id}`).set({ ...permission, id }, { merge: true });
      });

      // delete fields that are no config fields
      delete data.permissions;
      delete data.roles;
      delete data.categories;

      data.id = 1;

      const cfgPromise = admin.firestore().doc(`config/1`).set(data);

      await Promise.all([rolePromises, permissionsPromises, cfgPromise, categoryPromises]);

      return { success: true };

    } catch (e) {
      return e;
    }

  });

export const callSetupStep1 = setupStep1;
