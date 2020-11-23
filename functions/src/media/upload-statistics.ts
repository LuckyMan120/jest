import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as path from 'path';

export const incrementMediaCounter = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 120 })
  .storage.object().onFinalize(async (handler, context) => {

    const metadata = handler.metadata as any;
    const filePath = handler.name as string;
    const fileName = path.basename(filePath);

    const documentFormats = [
      'application/vnd.oasis.opendocument.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.text',
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/rtf',
      'application/vnd.visio',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/xml'
    ];

    if (!!!metadata || !!!metadata.sizes) {
      return null;
    }

    if (metadata && metadata.resizedImage === 'true') {
      return null;
    }
    if (fileName !== 'original') {
      return null;
    }

    if (!handler.contentType) {
      return null;
    }

    if (handler.contentType.startsWith('image/')) {
      return await admin.firestore().collection('statistics').doc('medias-statistics').set({
        imageCount: admin.firestore.FieldValue.increment(1)
      }, { merge: true });
    }

    if (handler.contentType.startsWith('video/') || ['application/x-shockwave-flash'].indexOf(handler.contentType) > -1) {
      return await admin.firestore().collection('statistics').doc('medias-statistics').set({
        videoCount: admin.firestore.FieldValue.increment(1)
      }, { merge: true });
    }

    if (handler.contentType.startsWith('audio/')) {
      return await admin.firestore().collection('statistics').doc('medias-statistics').set({
        audioCount: admin.firestore.FieldValue.increment(1)
      }, { merge: true });
    }

    if (handler.contentType.startsWith('text/') || documentFormats.indexOf(handler.contentType) > -1) {
      return await admin.firestore().collection('statistics').doc('medias-statistics').set({
        docsCount: admin.firestore.FieldValue.increment(1)
      }, { merge: true });
    }

    return await admin.firestore().collection('statistics').doc('medias-statistics').set({
      othersCount: admin.firestore.FieldValue.increment(1)
    }, { merge: true });

  });

export const decrementMediaCounter = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 120 })
  .storage.object().onDelete(async (handler, context) => {

    const metadata = handler.metadata as any;
    const filePath = handler.name as string;
    const fileName = path.basename(filePath);

    const documentFormats = [
      'application/vnd.oasis.opendocument.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.text',
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/rtf',
      'application/vnd.visio',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/xml'
    ];

    if (!!!metadata || !!!metadata.sizes) {
      return null;
    }

    if (metadata && metadata.resizedImage === 'true') {
      return null;
    }
    if (fileName !== 'original') {
      return null;
    }
    if (!handler.contentType) {
      return null;
    }

    if (handler.contentType.startsWith('image/')) {
      return await admin.firestore().collection('statistics').doc('medias-statistics').set({
        imageCount: admin.firestore.FieldValue.increment(-1)
      }, { merge: true });
    }

    if (handler.contentType.startsWith('video/') || ['application/x-shockwave-flash'].indexOf(handler.contentType) > -1) {
      return await admin.firestore().collection('statistics').doc('medias-statistics').set({
        videoCount: admin.firestore.FieldValue.increment(-1)
      }, { merge: true });
    }

    if (handler.contentType.startsWith('audio/')) {
      return await admin.firestore().collection('statistics').doc('medias-statistics').set({
        audioCount: admin.firestore.FieldValue.increment(-1)
      }, { merge: true });
    }

    if (handler.contentType.startsWith('text/') || documentFormats.indexOf(handler.contentType) > -1) {
      return await admin.firestore().collection('statistics').doc('medias-statistics').set({
        docsCount: admin.firestore.FieldValue.increment(-1)
      }, { merge: true });
    }

    return await admin.firestore().collection('statistics').doc('medias-statistics').set({
      othersCount: admin.firestore.FieldValue.increment(-1)
    }, { merge: true });

  });

