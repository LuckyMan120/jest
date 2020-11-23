import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { UploadOption } from '../_interfaces/upload.interface';


@Injectable({ providedIn: 'root' })
export class UploadService {

  private upload = new Subject<void>();
  private uploadDone = new Subject<void>();
  private currentOptions!: UploadOption;
  private currentId = 0;

  constructor() { }

  public get uid() {
    const result = this.currentId;
    this.currentId++;
    return result;
  }

  public get uploadObservable() {
    return this.upload.asObservable();
  }

  public startUpload(option: UploadOption) {
    this.currentOptions = option;
    if (this.upload.observers.length === 0) {
      return Promise.resolve();
    }
    const promise = new Promise((resolve, reject) => {
      this.upload.next();
      this.uploadDone.pipe(take(1)).subscribe(resolve);
    });
    return promise;

  }
  public get options() {
    return this.currentOptions;
  }
  public uploadFinish() {
    this.uploadDone.next();
  }
}
