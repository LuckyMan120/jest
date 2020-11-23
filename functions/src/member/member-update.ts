import { Member } from '@member/_interfaces/member.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import * as moment from 'moment';
import { getUserTitle, updateAssignedFields, updateDocumentsOnDelete, updateSingleField } from '../app-functions';
import { initAlgolia } from '../app/algolia';
import { Birthday } from '../shared/_classes/birthday.class';
import { ContentTargets } from '../shared/_interfaces/content-targets.interface';
import { ContentType } from '../shared/_interfaces/content-type.interface';
import { updateDetailStatisticsCounter } from '../statistics';
moment.locale('de');

export const onMemberUpdate = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 25 })
  .firestore.document('/members/{memberId}')
  .onUpdate(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises = [];
    const afterData = change.after.data() as Member;
    const beforeData = change.before.data() as Member;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (afterData.firstName !== beforeData.firstName ||
      afterData.lastName !== beforeData.lastName ||
      afterData.birthDate !== beforeData.birthDate) {
      const algolia = await initAlgolia();
      if (algolia) {
        const MEMBER_INDEX = algolia.initIndex('members');

        promises.push(MEMBER_INDEX.saveObject({
          firstName: afterData.firstName,
          lastName: afterData.lastName,
          title: getUserTitle(afterData as any),
          birthDate: afterData.birthDate,
          objectID: afterData.id,
          gerLocale: moment(afterData.birthDate).format('DD.MM.YYYY')
        }));
      }
    }

    if (afterData.birthDate) {
      promises.push(new Birthday().saveBirthdayAndBirthMonthDay(change.after.ref, afterData));
    }


    // update old assignedMemberTitles and Ids if assignedPlayerId changed
    if (afterData.assignedPlayerId) {
      // eslint-disable-next-line max-len
      promises.push(updateDocumentsOnDelete(context.params.memberId, [{ inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', collection: 'players' }]));
    }
    if (afterData.assignedSeniorId) {
      // eslint-disable-next-line max-len
      promises.push(updateDocumentsOnDelete(context.params.memberId, [{ inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', collection: 'seniors' }]));
    }

    // and set the new assignedPlayers
    const targets: ContentTargets[] = [
      { field: 'assignedMemberId', value: context.params.memberId },
      { field: 'assignedMemberTitle', value: afterData, outputFn: getUserTitle }
    ];
    if (afterData.assignedPlayerId) {
      // eslint-disable-next-line max-len
      promises.push(updateAssignedFields('players', afterData.assignedPlayerId, targets, 'assignedPlayerTitle', getUserTitle, change.after));
    }
    if (afterData.assignedSeniorId) {
      // eslint-disable-next-line max-len
      promises.push(updateAssignedFields('seniors', afterData.assignedSeniorId, targets, 'assignedSeniorTitle', getUserTitle, change.after));
    }


    // Update Stats if memberStatus has changed
    if (beforeData && beforeData.clubStatus !== afterData.clubStatus) {
      if (beforeData && beforeData.clubStatus) {
        const oldCategory = await admin.firestore().collection('categories').doc(beforeData.clubStatus).get();
        if (oldCategory.exists) {
          promises.push(updateDetailStatisticsCounter(`member`, oldCategory.data().title, admin.firestore.FieldValue.increment(-1)));
        }
      }
      if (afterData.clubStatus) {
        const newCategory = await admin.firestore().collection('categories').doc(afterData.clubStatus).get();
        if (newCategory.exists) {
          promises.push(updateDetailStatisticsCounter(`member`, newCategory.data().title, admin.firestore.FieldValue.increment(1)));
        }
      }
    }

    if (beforeData && getUserTitle(afterData) !== getUserTitle(beforeData)) {
      console.log('ToDo: update assigned docs if memberTitle has changed');
      console.log(getUserTitle(beforeData), getUserTitle(afterData));
      // ToDo: Update externMgmts { inputField: 'externMgmtMemberIds', titleField: 'externMgmtMemberIds', collection: 'teams' }
      const contentTypes: ContentType[] = [
        { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'club-honorary' },
        { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'club-management' },
        { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'matches' },
        { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'players' },
        { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'seniors' },
        { inputField: 'assignedMemberId', titleField: 'assignedMemberTitle', multiple: false, collection: 'trainings' },
      ];

      // eslint-disable-next-line max-len
      promises.push(contentTypes.map(c => updateSingleField(c.collection, c.inputField, c.multiple ? 'array-contains' : '==', context.params.memberId, afterData, c.titleField, getUserTitle)));
    }

    return await Promise.all(promises);

  });
