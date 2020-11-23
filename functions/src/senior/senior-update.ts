import { Senior } from '@senior/_interfaces/senior.interface';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import * as moment from 'moment';
import { getUserTitle, updateAssignedFields, updateDocumentsOnDelete, updateSingleField } from '../app-functions';
import { initAlgolia } from '../app/algolia';
import { Birthday } from '../shared/_classes/birthday.class';
import { ContentTargets } from '../shared/_interfaces/content-targets.interface';
import { ContentType } from '../shared/_interfaces/content-type.interface';
moment.locale('de');

export const onSeniorUpdate = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 25 })
  .firestore.document('/seniors/{seniorId}')
  .onUpdate(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises = [];
    const afterData = change.after.data() as Senior;
    const beforeData = change.before.data() as Senior;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (afterData.firstName !== beforeData.firstName ||
      afterData.lastName !== beforeData.lastName ||
      afterData.birthDate !== beforeData.birthDate) {
      const algolia = await initAlgolia();
      if (algolia) {
        const PLAYER_INDEX = algolia.initIndex('seniors');

        promises.push(PLAYER_INDEX.saveObject({
          firstName: afterData.firstName,
          lastName: afterData.lastName,
          title: getUserTitle(afterData),
          birthDate: afterData.birthDate,
          objectID: afterData.id,
          gerLocale: moment(afterData.birthDate).format('DD.MM.YYYY')
        }));
      }
    }

    if (afterData.birthDate) {
      promises.push(new Birthday().saveBirthdayAndBirthMonthDay(change.after.ref, afterData));
    }


    // Update old entries
    if (afterData.assignedMemberId) {
      // eslint-disable-next-line max-len
      promises.push(updateDocumentsOnDelete(context.params.seniorId, [{ inputField: 'assignedSeniorId', titleField: 'assignedSeniorTitle', collection: 'members' }]));
    }
    if (afterData.assignedPlayerId) {
      // eslint-disable-next-line max-len
      promises.push(updateDocumentsOnDelete(context.params.seniorId, [{ inputField: 'assignedSeniorId', titleField: 'assignedSeniorTitle', collection: 'players' }]));
    }


    const targets: ContentTargets[] = [
      { field: 'assignedSeniorId', value: context.params.seniorId },
      { field: 'assignedSeniorTitle', value: afterData, outputFn: getUserTitle }
    ];
    if (afterData.assignedMemberId) {
      // eslint-disable-next-line max-len
      promises.push(updateAssignedFields('members', afterData.assignedMemberId, targets, 'assignedMemberTitle', getUserTitle, change.after));
    }
    if (afterData.assignedPlayerId) {
      // eslint-disable-next-line max-len
      promises.push(updateAssignedFields('players', afterData.assignedPlayerId, targets, 'assignedPlayerTitle', getUserTitle, change.after));
    }

    if (beforeData && getUserTitle(afterData) !== getUserTitle(beforeData)) {
      console.log('ToDo: update assigned docs if seniorTitle has changed');
      console.log(getUserTitle(beforeData), getUserTitle(afterData));
      const contentTypes: ContentType[] = [
        { inputField: 'assignedSeniorId', titleField: 'assignedSeniorTitle', multiple: false, collection: 'members' },
        { inputField: 'assignedSeniorId', titleField: 'assignedSeniorTitle', multiple: false, collection: 'players' }
      ];
      // eslint-disable-next-line max-len
      promises.push(contentTypes.map(c => updateSingleField(c.collection, c.inputField, c.multiple ? 'array-contains' : '==', context.params.seniorId, afterData, c.titleField, getUserTitle)));
    }


    return await Promise.all(promises);

  });

