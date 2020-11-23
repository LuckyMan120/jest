import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class GravatarService {

  constructor() {
  }

  getUserGravatar(email: string) {
    const hashString = Md5.hashStr(email ? email : 'unknown');
    return `https://www.gravatar.com/avatar/${hashString}`;
  }
}
