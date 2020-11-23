import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { SocialPostData } from '../shared/_interfaces/social-post-data.interface';

const facebookGraphUrl = 'https://graph.facebook.com';
const pageId = functions.config().facebook.pageid;

export async function postSocialMessage(data: SocialPostData): Promise<string> {
  const pageAccessToken = await getPageTokenId(data.userAccessToken);
  return await postMessage(pageAccessToken, data.message, data.link, data.imageURL);
}

async function getPageTokenId(userAccessToken: string) {

  const url = new URL(facebookGraphUrl);
  url.pathname = `/${pageId}`;
  url.searchParams.append('fields', 'access_token');
  url.searchParams.append('access_token', userAccessToken);

  const res = await fetch(url.href);
  const value = await res.json();
  return value.access_token;
}

async function postMessage(pageAccessToken: string, message: string, linkUrl?: string, photoUrl?: any): Promise<string> {

  const url = new URL(facebookGraphUrl);

  if (linkUrl) {
    url.pathname = `/${pageId}/feed`;
    url.searchParams.append('message', message);
    url.searchParams.append('link', linkUrl);
  } else if (photoUrl && photoUrl.originalUrl) {
    url.pathname = `/${pageId}/photos`;
    url.searchParams.append('url', photoUrl.originalUrl);
    url.searchParams.append('caption', message);
  }

  url.searchParams.append('access_token', pageAccessToken);
  console.log('postMessage', url.href);
  const res = await fetch(url.href, { method: 'POST' });
  return await res.json();

}
