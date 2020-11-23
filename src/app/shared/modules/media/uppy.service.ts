import { Injectable } from '@angular/core';
import { compose, reduce, __ } from 'ramda';
import * as Uppy from 'uppy';

@Injectable()
export class UppyService {

  readonly uppy = Uppy;

  configure(pluginConfig: any, uuid: string): any {
    console.log(pluginConfig);
    const plugins = pluginConfig.map((test: any) => {
      /* const config =
        plugin !== 'Dashboard' && conf.target ? set(lensProp('target'), (Uppy as any)[conf.target], conf) :
          set(lensProp('target'), '.DashboardContainer-' + uuid, conf); */

      return Uppy; // [(Uppy as any)[plugin], config]
    });

    const addPlugin = (uppy: any, [name, conf]: [string, any]) => uppy.use(name, conf);

    const uppyInstance = compose(
      (u: any) => u.run(),
      reduce(addPlugin, __, plugins),
      Uppy.Core
    )();

    return uppyInstance({ autoProceed: true });
  }

}
