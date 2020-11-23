import { Category } from '@category/_interfaces/category.interface';
import {
  DocumentReference, DocumentSnapshot, FieldValue,
  QueryDocumentSnapshot, WhereFilterOp, WriteResult
} from '@google-cloud/firestore';
import { Match } from '@match/_interfaces/match.interface';
import { Member } from '@member/_interfaces/member.interface';
import { Player } from '@player/_interfaces/player.interface';
import { Senior } from '@senior/_interfaces/senior.interface';
import { Team } from '@team/_interfaces/team.interface';
import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import _ from 'lodash';
import * as moment from 'moment';
import { ContentTargets } from './shared/_interfaces/content-targets.interface';
import { ContentType } from './shared/_interfaces/content-type.interface';


export const getMatchTitle = (match: Match) => {
  const startDate: Date = match.matchStartDate ? new Date(match.matchStartDate) : new Date();
  // eslint-disable-next-line max-len
  return `${match.playersType}: ${(match.homeTeam as Team).title} - ${(match.guestTeam as Team).title} (${moment(startDate).format('DD.MM.YYYY')})`;
};

export const getUserTitle = (data: User | Player | Member | Senior): string => {
  if (!data) {
    return 'Arno Nym';
  }
  return ('displayName' in data) ?
    data.displayName :
    (data.firstName || data.lastName) ?
      `${data.firstName} ${data.lastName}` :
      ('email' in data) ?
        data.email : 'Arno Nym';
};

export const getUserData = (data: User) => {
  return {
    displayName: getUserTitle(data),
    photoUrl: data.photoUrl,
    assignedRoles: data.assignedRoles
  };
};

export const getTeamTitle = (team: Team) => {
  return `${team.title} ${team.subTitle} (${team.assignedSeasonTitle})`;
};

export const checkForChangedData = (beforeData: any, afterData: any, fieldName: string, compareField?: string) => {
  if (!compareField) {
    return !beforeData || !_.isEqual(beforeData[fieldName], afterData[fieldName]);
  } else {
    return !beforeData || !_.isEqual(beforeData[fieldName], afterData[fieldName]) ||
      compareField ? afterData[fieldName].length !== afterData?.[compareField].length : false;
  }
};

export const createResultArray = (docs: DocumentSnapshot[], fieldNameOrFn: string | Function): any[] => {
  const result: any[] = [];
  for (const doc of docs) {
    if (typeof fieldNameOrFn === 'string') {
      const data = doc.data();
      if (data) {
        const field = data[fieldNameOrFn];
        result.push(field);
      }
    } else {
      result.push(fieldNameOrFn(doc.data()));
    }
  }
  return result;
};

/*
export const updateNewAndDeletedStatisticsCounters = (
  docName: 'article' | 'category' | 'location' | 'match' | 'member' | 'player' | 'senior' | 'sponsor' | 'team' | 'user',
  fieldName: string,
  beforeData: any,
  afterData: any
): Promise<FirebaseFirestore.WriteResult> => {
  const valuesToUpdate: any = {};
  const unusedItems = beforeData[fieldName].filter((id: string) => afterData.assignedRoles.indexOf(id) === -1);
  for (const id of unusedItems) {
    valuesToUpdate[id] = admin.firestore.FieldValue.increment(-1);
  }
  const newItems = afterData[fieldName].filter((id: string) => beforeData.assignedRoles.indexOf(id) === -1);
  for (const id of newItems) {
    valuesToUpdate[id] = admin.firestore.FieldValue.increment(1);
  }
  return admin.firestore().collection(`statistics`).doc(`${docName}-statistics`).set(valuesToUpdate, { merge: true });
};


/**
 * splits an array in {chunkSize} parts
 * @param inputArray any[]
 * @param chunkSize number
 */
export const chunkArray = (inputArray: any[], chunkSize: number = 10): [] => {
  return inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
};


export const getAssignedFieldValue = async (
  inputArray: any[] | undefined,
  collection: string,
  outputField: string | Function): Promise<any> => {
  if (!inputArray || inputArray.length === 0) {
    return null;
  }
  const chunks = chunkArray(inputArray, 10);
  const promises = chunks.map((chunk: any) => admin.firestore().collection(collection).where('id', 'in', chunk).get());
  const [itemDocs] = await Promise.all(promises);
  return createResultArray(itemDocs.docs, outputField);
};


export const updateSingleField = async (
  collection: string,
  inputField: string,
  comparisonOperator: WhereFilterOp,
  inputValue: any,

  data: any,
  outputField: string,
  outputValue?: string | {},
  outputFn?: | Function): Promise<WriteResult[]> => {

  let promises = [];

  const items = await admin.firestore().collection(collection).where(inputField, comparisonOperator, inputValue).get();
  if (items.size > 0) {
    console.log('found ' + items.size);
    const valueToUpdate: any = {};

    if (outputFn) {
      valueToUpdate[outputField] = (outputFn)(data);
    } else {
      if (outputValue) {
        valueToUpdate[outputField] = outputValue;
      } else {
        valueToUpdate[outputField] = data[outputField] ? data[outputField] : FieldValue.delete();
      }
    }
    console.log(valueToUpdate[outputField]);
    promises = items.docs.map((doc: DocumentSnapshot) => doc.ref.set(valueToUpdate, { merge: true }));
  }

  return await Promise.all(promises);
};

export const updateAssignedFields = async (
  collection: string,
  docId: string | undefined,
  targets: ContentTargets[],
  sourceField?: string,
  sourceFn?: Function,
  snap?: DocumentSnapshot,
  targetField?: string): Promise<any> => {

  const promises: Promise<any>[] = [];
  if (docId) {
    const doc = (await admin.firestore().doc(`${collection}/${docId}`).get());
    if (doc.exists) {
      const valueToUpdate: any = {};
      targets.map(target => {
        if (target.multiple) {
          valueToUpdate[target.field] = [...doc.data()[target.field], target.outputFn ? target.outputFn(target.value) : target.value];
        } else {
          valueToUpdate[target.field] = target.outputFn ? target.outputFn(target.value) : target.value;
        }
      });
      promises.push(doc.ref.set(valueToUpdate, { merge: true }));

      if (sourceField && snap) {
        const sourceUpdate: any = {};
        sourceUpdate[sourceField] = sourceFn ? sourceFn(doc.data()) : doc.data()[targetField];
        promises.push(snap.ref.set(sourceUpdate, { merge: true }));
      }

    }
  }
  return await Promise.all(promises);
};


export const updateDocumentsOnDelete = async (id: string, types: ContentType[]): Promise<any> => {
  const afs = admin.firestore();

  // eslint-disable-next-line max-len
  const promises = types.map(type => afs.collection(type.collection).where(type.inputField, type.multiple ? 'array-contains' : '==', id).get());
  const snapshots = await Promise.all(promises);

  const results: Promise<any>[] = [];

  Object.values(snapshots).map((collections, idx) => collections.docs.map(doc => {

    const type: ContentType = types[idx];
    const data = doc.data();

    if (type.multiple as boolean) {
      const index = doc.data()[type.inputField].indexOf(id);
      data[type.inputField].splice(index, 1);
      if (type.titleField) {
        data[type.titleField].splice(index, 1);
      }
      results.push(doc.ref.set(data, { merge: true }));
    } else {
      if (type.deleteCompleteEntity) {
        results.push(doc.ref.delete());
      } else {
        data[type.inputField] = FieldValue.delete();
        if (type.titleField) {
          data[type.titleField] = FieldValue.delete();
        }
        results.push(doc.ref.set(data, { merge: true }));
      }
    }
  }));

  return results;
};

export const generateDetailedCategoryStatistics = async (beforeCategoryIds: string[], afterCategoryIds: string[], docName: string) => {

  const updateCategories: any = {};

  const unusedCategories: string[] | undefined = beforeCategoryIds.filter(categoryId => !afterCategoryIds.includes(categoryId));
  if (unusedCategories && unusedCategories.length > 0) {
    const unusedCategoryPromises = unusedCategories.map((categoryId: string) => admin.firestore().doc(`categories/${categoryId}`).get());
    const unusedCategoryResult = await Promise.all(unusedCategoryPromises);
    unusedCategoryResult.filter(doc => doc.exists).map(category => category.data() as Category)
      .map((category: Category) => updateCategories[category.title] = admin.firestore.FieldValue.increment(-1));
  }


  const newCategories: string[] | undefined = afterCategoryIds.filter(categoryId => !beforeCategoryIds.includes(categoryId));
  if (newCategories && newCategories.length > 0) {
    const newCategoryPromises = newCategories.map((categoryId: string) => admin.firestore().doc(`categories/${categoryId}`).get());
    const newCategoryResult = await Promise.all(newCategoryPromises);
    newCategoryResult.filter(doc => doc.exists).map(category => category.data() as Category)
      .map((category: Category) => updateCategories[category.title] = admin.firestore.FieldValue.increment(1));
  }
  return await admin.firestore().collection(`statistics`).doc(`${docName}-statistics`).set(updateCategories, { merge: true });
};

export const setAssignedCategoryTitles = async (assignedCategoryIds: string[], ref: DocumentReference) => {
  const categoryPromises = assignedCategoryIds.map((catId: string) => admin.firestore().doc(`categories/${catId}`).get());
  const categories = (await Promise.all(categoryPromises)).map((category: QueryDocumentSnapshot) => category.data() as Category);
  return ref.set({ assignedCategoryTitles: categories.map((category: Category) => category.title) }, { merge: true });
};

export const assert = (data: any, key: string) => {
  if (!data[key]) {
    throw new functions.https.HttpsError('invalid-argument', `function called without ${key} data`);
  } else {
    return data[key];
  }
};

// Validates auth context for callable function
export const assertUID = (context: any) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('permission-denied', 'function called without context.auth');
  } else {
    return context.auth.uid;
  }
};

// Sends a descriptive error response when running a callable function
export const catchErrors = async (promise: Promise<any>) => {
  try {
    return await promise;
  } catch (err) {
    throw new functions.https.HttpsError('unknown', err);
  }
};
