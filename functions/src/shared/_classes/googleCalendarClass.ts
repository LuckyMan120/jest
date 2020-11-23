/* eslint-disable camelcase */
import { calendar_v3, google } from 'googleapis';
import { SERVICE_ACCOUNT } from './../../index';

export class GoogleCalendar {

  public async getApi(): Promise<calendar_v3.Calendar> {
    const auth = await this.getAuth();
    return google.calendar({ version: 'v3', auth });
  }

  public createEvent(calendarAPI: any, calendarId: string, event: any) {
    if (event.id) {
      return calendarAPI.events.update({ calendarId, eventId: event.id, resource: event });
    } else {
      return calendarAPI.events.insert({ calendarId, resource: event });
    }
  }

  public getEvents(calendarAPI: calendar_v3.Calendar, calendarData: calendar_v3.Params$Resource$Events$List) {
    return calendarAPI.events.list(calendarData);
  }

  public deleteEvent(calendarAPI: calendar_v3.Calendar, calendarId: string, event: any) {
    return calendarAPI.events.delete({ calendarId, eventId: event.id });
  }

  protected getJwt() {
    const SCOPES = 'https://www.googleapis.com/auth/calendar';
    return new google.auth.JWT(SERVICE_ACCOUNT.client_email, undefined, SERVICE_ACCOUNT.private_key, SCOPES);
  }

  protected getAuth() {
    const auth = new google.auth.GoogleAuth({
      keyFile: './serviceAccounts/sf-wtb.json',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    return auth.getClient();
  }

}
