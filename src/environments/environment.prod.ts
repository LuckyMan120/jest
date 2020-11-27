import { environment as common } from './environment';


export const environment = {
  common,
  production: true,
  useEmulators: false,
  enableLogging: false,
  firebaseConfig: {
    apiKey: 'AIzaSyAGmFa4XgNUxpbXggpvgaFKfKdPDaWF9rs',
    authDomain: 'sfw-prod-db.firebaseapp.com',
    databaseURL: 'https://sfw-prod-db.firebaseio.com',
    projectId: 'sfw-prod-db',
    storageBucket: 'sfw-prod-db.appspot.com',
    messagingSenderId: '291638670252',
    appId: '1:291638670252:web:a63c87920dda0c65ee4009',
    measurementId: 'G-P4K6TR8Q8N'

  },
  routerTracing: false,
  cacheControl: 'public,max-age=7200'
};
