import { Player } from '@player/_interfaces/player.interface';
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

export const onPlayerUpdate = functions
  .region('europe-west1')
  .runWith({ memory: '512MB', timeoutSeconds: 25 })
  .firestore.document('/players/{playerId}')
  .onUpdate(async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {

    const promises = [];
    const afterData = change.after.data() as Player;
    const beforeData = change.before.data() as Player;

    if (!afterData || _.isEqual(beforeData, afterData)) {
      return true;
    }

    if (afterData.firstName !== beforeData.firstName ||
      afterData.lastName !== beforeData.lastName ||
      afterData.birthDate !== beforeData.birthDate) {
      const algolia = await initAlgolia();
      if (algolia) {
        const PLAYER_INDEX = algolia.initIndex('players');

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
      promises.push(updateDocumentsOnDelete(context.params.playerId,
        [{ inputField: 'assignedPlayerId', titleField: 'assignedPlayerTitle', collection: 'members' }]
      ));
    }
    if (afterData.assignedSeniorId) {
      promises.push(updateDocumentsOnDelete(context.params.playerId,
        [{ inputField: 'assignedPlayerId', titleField: 'assignedPlayerTitle', collection: 'seniors' }]
      ));
    }


    const targets: ContentTargets[] = [
      { field: 'assignedPlayerId', value: context.params.playerId },
      { field: 'assignedPlayerTitle', value: afterData, outputFn: getUserTitle }
    ];
    if (afterData.assignedMemberId) {
      // eslint-disable-next-line max-len
      promises.push(updateAssignedFields('members', afterData.assignedMemberId, targets, 'assignedMemberTitle', getUserTitle, change.after));
    }
    if (afterData.assignedSeniorId) {
      // eslint-disable-next-line max-len
      promises.push(updateAssignedFields('seniors', afterData.assignedSeniorId, targets, 'assignedSeniorTitle', getUserTitle, change.after));
    }


    if (beforeData && getUserTitle(afterData) !== getUserTitle(beforeData)) {
      // ToDo: Update externMgmts { inputField: 'externMgmtMemberIds', titleField: 'externMgmtMemberIds', collection: 'teams' }
      const contentTypes: ContentType[] = [
        { inputField: 'assignedPlayerIds', titleField: 'assignedPlayerTitles', multiple: true, collection: 'teams' },

        { inputField: 'assignedPlayerId', titleField: 'assignedPlayerTitle', multiple: false, collection: 'members' },
        { inputField: 'assignedPlayerId', titleField: 'assignedPlayerTitle', multiple: false, collection: 'seniors' }
      ];
      // eslint-disable-next-line max-len
      promises.push(contentTypes.map(c => updateSingleField(c.collection, c.inputField, c.multiple ? 'array-contains' : '==', context.params.playerId, afterData, c.titleField, getUserTitle)));
    }


    if (beforeData && beforeData.ageGroup !== afterData.ageGroup) {
      promises.push(updateDetailStatisticsCounter(`player`, beforeData.ageGroup, admin.firestore.FieldValue.increment(-1)));
      promises.push(updateDetailStatisticsCounter(`player`, afterData.ageGroup, admin.firestore.FieldValue.increment(1)));
    }


    return await Promise.all(promises);

  });

