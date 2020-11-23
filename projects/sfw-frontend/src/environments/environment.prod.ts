import { version } from '../../../../package.json';

export const environment = {
  production: true,
  version: version,
  useEmulators: false,
  enableLogging: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCAEhG93u8ZxGN6y8Z1zgB55bW5Q0BYN38',
    authDomain: 'sf-wtb.firebaseapp.com',
    databaseURL: 'https://sf-wtb.firebaseio.com',
    projectId: 'sf-wtb',
    storageBucket: 'sf-wtb.appspot.com',
    messagingSenderId: '924384840335',
    appId: '1:924384840335:web:16ad5cfc92cf81ff2d7efa',
    measurementId: 'G-7B8T2ZHNN8'
  },
  routerTracing: false
};
