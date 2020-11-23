import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { get } from 'ts-object-path';
import { MenuItem } from './../_interfaces/menu-item.interface';

@Injectable()
export class LayoutConfigService {

  onConfigUpdated$: Subject<MenuItem[]>;
  layoutConfig!: MenuItem[];

  constructor() {
    this.onConfigUpdated$ = new Subject();
  }

  saveConfig(layoutConfig: MenuItem[]): void {
    if (layoutConfig) {
      localStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
      localStorage.setItem('layoutConfigUpdate', new Date().toISOString());
    }
  }

  getSavedConfig(): MenuItem[] {
    return JSON.parse(localStorage.getItem('layoutConfig') as string);
  }

  resetConfig(): void {
    localStorage.removeItem('layoutConfig');
  }

  getConfig() {
    return this.layoutConfig;
  }

  getConfigValue(path?: string): any {
    try {
      return this.layoutConfig.find((entry: MenuItem) => entry.id === path)?.value;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  setConfig(path: string, value: any, save?: boolean): void {
    this.layoutConfig = this.layoutConfig.map((entry: MenuItem) => {
      if (entry.id === path) {
        entry.value = value;
      }
      return entry;
    });
    if (save) {
      this.saveConfig(this.layoutConfig);
    }
    this.onConfigUpdated$.next(this.layoutConfig);
  }


  getLogo(): string {
    const menuAsideLeftSkin = this.getConfigValue('brandSelfSkin');
    const logoObject = this.getConfigValue('selfLogo');

    let logo: any;
    if (typeof logoObject === 'string') {
      logo = logoObject;
    }
    if (typeof logoObject === 'object') {
      logo = get(logoObject, menuAsideLeftSkin + '');
    }
    if (typeof logo === 'undefined') {
      const logos = this.getConfigValue('selfLogo') as any;
      logo = logos[Object.keys(logos as any)[0]];
    }
    return logo;
  }

  getStickyLogo(): string {
    let logo = this.getConfigValue('selfLogoSticky');
    if (typeof logo === 'undefined') {
      logo = this.getLogo();
    }
    return logo + '';
  }

  loadConfig(config: MenuItem[]) {
    this.layoutConfig = config;
    this.saveConfig(this.layoutConfig);
  }

  reloadConfigs(): MenuItem[] {
    this.layoutConfig = this.getSavedConfig();
    this.onConfigUpdated$.next(this.layoutConfig);
    return this.layoutConfig;
  }

}
