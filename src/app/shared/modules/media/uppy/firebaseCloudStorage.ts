import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadMetadata } from '@angular/fire/storage/interfaces';
import { Plugin } from '@uppy/core';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { UploadService } from '../../../services/upload.service';

export default class FirebaseCloudStorage extends Plugin {

  private title: string;
  private tags: string[];
  private storage: AngularFireStorage;
  private auth: AngularFireAuth;
  private afs: AngularFirestore;
  private service: UploadService;
  private galleryName: string;

  constructor(uppy: any, opts: any) {
    super(uppy, opts);
    if (!opts.storage) {
      throw Error(
        `Please provide the root storageRef to be used as option storageRef.
        See https://firebase.google.com/docs/storage/web/upload-files`
      );
    }
    this.type = 'uploader';
    this.id = 'FirebaseCloudStorage';
    this.title = 'Firebase Cloud Storage';
    this.storage = opts.storage;
    this.auth = opts.auth;
    this.afs = opts.afs;
    this.uploadFile = this.uploadFile.bind(this);
    this.service = opts.service;
    this.galleryName = opts.galleryName;
    this.tags = opts.tags;
  }


  async uploadFile(fileIds: string[]): Promise<any> {

    const userId = await this.auth.user.pipe(take(1), map(user => user?.uid)).toPromise();

    const promises = fileIds.map(id => {
      // return new Promise(async (resolve, reject) => {
      const uppy = (this.uppy as any);
      const file = uppy.getFile(id);
      console.log(file);
      const refId = this.afs.createId();

      const fileRef = this.storage.ref(`medias/${userId}/${refId}/original`);
      const cacheControl = environment.cacheControl;

      let metaDataFromForm = {};
      if (file.meta) {
        metaDataFromForm = {
          author: file.meta.author,
          title: file.meta.title,
          description: file.meta.description
        };
      }

      const metaData: UploadMetadata = {
        contentType: file.type,
        cacheControl,
        customMetadata: {
          fileName: file.name,
          fileExtension: file.extension,
          fileType: file.type,
          fileSize: file.size,
          isRemote: file.isRemote,
          sizes: '128;256;512;1024;2048',
          // galleryName: this.galleryName,
          // tags: this.tags.join(';'),
          ...this.service.options,
          ...metaDataFromForm
        }
      };
      uppy.emit('upload-started', file);
      const uploadTask = fileRef.put(file.data, metaData);

      uploadTask.snapshotChanges().subscribe(
        (snapshot) => {
          const progressInfo = {
            uploader: this,
            bytesUploaded: snapshot?.bytesTransferred,
            bytesTotal: snapshot?.totalBytes
          };
          uppy.emit('upload-progress', file, progressInfo);
        },
        error => {
          uppy.emit('upload-error', file, error);
          // reject(error);
        },
        () => {
          uppy.emit(
            'upload-success',
            file,
            uploadTask.task
          );
          // resolve();
        }
      );
      return uploadTask;
    });

    return await Promise.all(promises);

  }

  install() {
    this.uppy.addUploader(this.uploadFile);
  }

  uninstall() {
    this.uppy.removeUploader(this.uploadFile);
  }
}
