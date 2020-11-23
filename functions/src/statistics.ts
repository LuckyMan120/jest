import { WriteResult } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';

export const createLatestDoc = async (
  collection: 'articles' | 'categories' | 'locations' | 'matches' | 'members' | 'players' | 'seniors' | 'sponsors' | 'teams' | 'users',
  documentName: string,
  titleField?: string,
  fn?: Function
): Promise<WriteResult> => {
  const items = await admin.firestore().collection(collection).orderBy('creation.at', 'desc').limit(1).get();
  if (items.size > 0) {
    const doc = items.docs[0];
    if (doc) {
      return admin.firestore().collection(`statistics`).doc(documentName).set({
        id: doc.data().id,
        title: fn ? fn(doc.data()) : titleField ? doc.data()[titleField] : items.docs[0].data().title
      });
    }
  }

  return admin.firestore().collection(`statistics`).doc(documentName).delete();

};

export const updateStatisticsCounter = (
  type: 'Artikel' | 'Kategorien' | 'Spielorte' | 'Spiele' | 'Mitglieder' | 'Spieler'
    | 'AH-Mitglieder' | 'Sponsoren' | 'Mannschaften' | 'Benutzer',
  increment: any
): Promise<WriteResult> => {
  const valueToUpdate: any = {};
  valueToUpdate[type] = increment;
  return admin.firestore().collection('statistics').doc(`currentApplication`).set(valueToUpdate, { merge: true });
};

export const updateDetailStatisticsCounter = (
  docName: 'article' | 'category' | 'location' | 'match' | 'member' | 'player' | 'senior' | 'sponsor' | 'team' | 'user',
  type: string,
  increment: any
): Promise<WriteResult> => {
  const valueToUpdate: any = {};
  valueToUpdate[type] = increment;
  return admin.firestore().collection(`statistics`).doc(`${docName}-statistics`).set(valueToUpdate, { merge: true });
};
