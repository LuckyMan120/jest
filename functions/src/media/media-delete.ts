import { MediaItem } from '@shared/_interfaces/media-item.interface';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const onMediaDelete = functions
  .region('europe-west1')
  .runWith({ memory: '256MB', timeoutSeconds: 5 })
  .firestore.document('medias/{mediaId}')
  .onDelete(async (snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {

    const data = snapshot.data() as MediaItem;
    const userId = data.creation.by;
    const mediaId = data.id;
    const bucket = admin.storage().bucket();

    return bucket.deleteFiles({ prefix: `medias/${userId}/${mediaId}` });
  });
