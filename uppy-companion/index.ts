
import * as companion from '@uppy/companion';
import * as bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import serveFavicon = require('serve-favicon');

const app = express();
const secret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 12);

app.use(bodyParser.json());
app.use(session({
  secret,
  resave: true,
  saveUninitialized: true,
  /* cookie: {
    sameSite: true,
    secure: true
  } */
}));

app.use(serveFavicon(path.join(__dirname, 'favicon.ico')));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, Content-Type, Accept'
  );
  next();
});


app.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('🎉 Welcome to Companion 🎉');
});

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8083;

const uppyOptions = {
  providerOptions: {
    drive: { // works
      key: '924384840335-fgs1mc224r9oe471bklf3lahitpghk39.apps.googleusercontent.com', // process.env.GOOGLE_DRIVE_KEY,
      secret: 'dSHHbr72Kjx9dYT8OVhU9DL0', // process.env.GOOGLE_DRIVE_SECRET
    },
    dropbox: { // works
      key: '2afpqi93wx6w8au',
      secret: '5nqps9smy21taj9', // process.env.DROPBOX_SECRET
    },
    instagram: {
      key: '2428350217266292', // process.env.INSTAGRAM_KEY,
      secret: '0d69dcf66211c5d8c1189690bc0f48f8', // process.env.INSTAGRAM_SECRET
    },
    facebook: { // works
      key: '431939683855219', // process.env.FACEBOOK_KEY,
      secret: '578ec9e8836c3a216cc3ed52b6d90bec', // process.env.FACEBOOK_SECRET
    }/* ,
    unsplash: {
      key: 's3qhbs4B6GQuS028IlNuBL1wG-KvxeL6SV9eDpcZn6Q',
      secret: 'URIr-haxO0B0O4B-wpseckkb675KyEZTgsXVn8NRcO8'
    }*/
  },
  server: {
    host: `${HOST}:${PORT}`,
    // protocol: 'https'
  },
  filePath: path.join(os.tmpdir(), 'uppy'), // path.join(os.tmpdir(), 'uppy')
  secret,
  debug: true,
  // sendSelfEndpoint: `https://${HOST}:${PORT}`
};

if (!fs.existsSync(path.join(os.tmpdir(), 'uppy'))) {
  console.log('Directory didn´t exist - trying to create it');
  fs.mkdirSync(path.join(os.tmpdir(), 'uppy'));
}

app.use(companion.app(uppyOptions));

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({ message: 'Not Found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('\x1b[31m', err.stack, '\x1b[0m');
  res.status(err.status || 500).json({ message: err.message, error: err });
});

companion.socket(app.listen(PORT), uppyOptions);

console.log('Welcome to Companion!');
console.log(`App listening on port ${PORT}`);
