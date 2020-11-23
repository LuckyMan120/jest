import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { createProxy, get } from 'ts-object-path';

@Injectable()
export class PageConfigService {

  onConfigUpdated$: Subject<any>;
  pageConfig: any;

  constructor(private router: Router) {
    this.onConfigUpdated$ = new Subject();
  }

  isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  mergeDeep(target: any, source: any) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  getCurrentPageConfig(path?: string): any {
    let url = this.router.url;

    if (new RegExp(/^\/de/).test(url)) {
      const urls = url.split('/');
      urls.splice(0, 2);
      url = urls.join('/');
    }

    let configPath = url.replace(/\//g, '.');

    if (path) {
      configPath += '.' + path;
    }

    const p = createProxy<any>();
    return get(this.pageConfig, p.configPath);
  }

  setConfig(value: any, save?: boolean): void {
    this.pageConfig = this.mergeDeep(this.pageConfig, value);

    if (save) {
    }

    this.onConfigUpdated$.next(this.pageConfig);
  }

  loadConfigs(config: any) {
    this.pageConfig = config;
    this.onConfigUpdated$.next(this.pageConfig);
  }
}
