import { spawn } from 'child-process-promise';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import mkdirp from 'mkdirp-promise';
import * as os from 'os';
import * as path from 'path';
import urljoin from 'url-join';

// Thumbnail prefix added to file names.
// const THUMB_REGEXP = '^[0-9]+x[0-9]+';
const PATH_GROUP_REGEXP = '^medias\/([a-zA-Z0-9_]*)\/([a-zA-Z0-9_]*)\/.+$';

/*
* Create thumbnail based on the metada of the file
*/
export const uploadHandler = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 120 })
  .storage.object().onFinalize(async (handler, context) => {

    // Some variables // example if we upload images/avatars/123456
    const metadata = handler.metadata as any;
    const filePath = handler.name as string; // filePath = images/avatars/123456/original
    const fileName = path.basename(filePath); // fileName = original


    // update document if document path provided
    // await updateDocument(metadata, filePath);
    await updateMediaDocument(metadata, filePath);

    if (!!!metadata || !!!metadata.sizes) {
      return null;
    }

    if (metadata && metadata.resizedImage === 'true') {
      return null;
    }
    if (fileName !== 'original') {
      return null;
    }

    // Exit if this is triggered on a file that is not an image.
    if (!handler.contentType || !handler.contentType.startsWith('image/')) { // || handler.contentType === 'image/webp'
      return null;
    }

    await generateThumbnails(handler);

    return true;
  });


async function generateThumbnails(handler: functions.storage.ObjectMetadata) {


  // Some variables // example if we upload images/avatars/123456
  const metadata = handler.metadata as any;
  const filePath = handler.name as string; // filePath = images/avatars/123456/original
  const fileDir = path.dirname(filePath); // fileDir = images/avatars/123456
  const tempLocalFile = path.join(os.tmpdir(), filePath); // tempLocalFile = tmp/images/avatars/123456/original
  const tempLocalDir = path.dirname(tempLocalFile); // tempLocalFir = tmp/images/avatars/123456

  // Cloud Storage files.
  const bucket = admin.storage().bucket();
  const file = bucket.file(filePath);

  await file.makePublic();

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir);

  // config to get the file from the bucket
  const downloadConfig = {
    destination: tempLocalFile
  };
  // download the file and store it on the file system
  await file.download(downloadConfig);


  /*
  // if a SVG preview is required
  let svgPreview: any;

  try {
    const result = await sqip({
      filename: tempLocalFile
    });
    svgPreview = result.final_svg;
  } catch (error) {
    console.error(error);
  }
  */

  // get thumbnail sizes from the metadata
  // TODO: maybe add a check on the size itself avoid creating a thumbnail of > 1024px ?
  try {
    const sizes = metadata.sizes.split(';');
    for (const size of sizes) {

      // create thumbnail variables
      const thumbFileName = `${size}x${size}`;
      const thumbFilePath = path.normalize(path.join(fileDir, thumbFileName));
      const tempLocalThumbFile = path.join(tempLocalDir, thumbFileName);

      // create thumbnail
      try {
        // await spawn('convert', [tempLocalFile, '-thumbnail', `${size}x${size}>`, tempLocalThumbFile]);
        await spawn('convert', [tempLocalFile, '-thumbnail', `${size}x${size}>`, tempLocalThumbFile]);

        // const uploadedFile = await bucket.upload(tempLocalThumbFile, {
        const uploadedFile = await bucket.upload(tempLocalThumbFile, {
          resumable: false,
          destination: thumbFilePath,
          metadata: {
            contentType: handler.contentType,
            cacheControl: handler.cacheControl,
            metadata: {
              resizedImage: 'true',
              size: size
            }
          }
        });
        await uploadedFile[0].makePublic();

      } catch (error) {
        console.error('error in generation of thumbnails', error);
      } finally {
        console.log('deleting temp local dir', tempLocalThumbFile);
        fs.unlinkSync(tempLocalThumbFile);
      }
    }
  } catch (error) {
    console.error('error in generation of thumbnails', error);
  } finally {
    console.log('deleting temp local dir', tempLocalFile);
    fs.unlinkSync(tempLocalFile);
  }
  return true;

}


async function updateMediaDocument(metadata: { [key: string]: string; }, filePath: string) {

  try {
    const userAndMediaIds = getUserIdAndMediaIdFromFilePath(filePath);

    // Generated from us we only update the document path if present
    if (metadata && userAndMediaIds !== null) {

      const bucketName = admin.storage().bucket().name;
      const url = urljoin('https://storage.googleapis.com', bucketName, filePath);
      const size = metadata.size;
      if (size) {
        return admin.firestore().collection('medias').doc(userAndMediaIds.mediaId).set({ sizes: { [size]: url } }, { merge: true });
      } else {
        const data = {
          id: userAndMediaIds.mediaId,
          creation: {
            by: userAndMediaIds.userId,
            at: new Date().valueOf()
          },
          originalUrl: url,
          metadata
        };

        return admin.firestore().collection('medias').doc(userAndMediaIds.mediaId).set(data, { merge: true });
      }
    }
    console.log('updateMediaDocument nohting to do', metadata, userAndMediaIds);
    return null;

  } catch (error) {
    console.error('updateMediaDocument failed', error);
  }
  return null;
}

function getUserIdAndMediaIdFromFilePath(filePath: string) {
  const regExpResult = filePath.match(PATH_GROUP_REGEXP) || [];

  const userId = regExpResult[1];
  const mediaId = regExpResult[2];
  if (userId && mediaId) {
    return { userId, mediaId };
  } else {
    return null;
  }

}
