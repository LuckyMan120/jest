/* eslint-disable camelcase */
import { DocumentSnapshot, QuerySnapshot } from '@google-cloud/firestore';
import { Member } from '@member/_interfaces/member.interface';
import { Player } from '@player/_interfaces/player.interface';
import { Senior } from '@senior/_interfaces/senior.interface';
import { Config } from '@shared/_interfaces/config.interface';
import { User } from '@user/_interfaces/user.interface';
import { getJsDateFromExcel } from 'excel-date-to-js';
import * as admin from 'firebase-admin';
import { google, sheets_v4 } from 'googleapis';
import * as moment from 'moment';
import { getUserTitle } from './../../../app-functions';
import { SERVICE_ACCOUNT } from './../../../index';
moment.locale('de');

export class GoogleSheetImporter {

  public async importData(sheetTitle: string, collection: 'members' | 'seniors', config: Config, author: User) {
    let data: any;
    try {
      // console.log(SA);
      const sheetsAPI = await this.getSheetsAPI();
      const workbook = await this.getWorkbook(sheetsAPI, config);
      console.log(`[GoogleSheetImporter - getWorkbook] Found Workbook ${config.googleDriveMemberSheet}`);

      if (workbook && workbook.data && workbook.data.sheets && workbook.data.sheets.length > 0) {

        const sheet = workbook.data.sheets.find(s => s.properties?.title === sheetTitle);
        if (sheet && sheet.bandedRanges && sheet.bandedRanges.length > 0) {
          // const range = sheet.bandedRanges[0];
          data = await sheetsAPI.spreadsheets.values.get({
            spreadsheetId: config.googleDriveMemberSheet,
            range: `${sheetTitle}`, // !${this.getRangeAsA1Notation(range.range)}`,
            valueRenderOption: 'UNFORMATTED_VALUE'
          });
        }
      }

      let items: any;
      items = data.data.values
        .slice(2) // filter title and table header
        .filter((row: any) => typeof row[0] !== 'undefined' && (row[0] === 'Herr' || row[0] === 'Frau')); // filter rows with no salutation

      const existingPlayerSnapshots = await admin.firestore().collection('players').get() as QuerySnapshot<Player>;

      let existingSeniorSnapshots: QuerySnapshot<Senior>;
      let existingMemberSnapshots: QuerySnapshot<Member>;
      if (collection === 'members') {
        existingSeniorSnapshots = await admin.firestore().collection('seniors').get() as QuerySnapshot<Senior>;
        items = items.map((row: Member) => this.parseMemberRow(row, author));
      } else {
        existingMemberSnapshots = await admin.firestore().collection('members').get() as QuerySnapshot<Member>;
        items = items.map((row: Senior) => this.parseSeniorRow(row, author));
      }

      console.log(`[GoogleSheetImporter - parse] Found ${items.length} ${collection}`);

      items = items.filter((item: any) => item);
      const existingData = (await admin.firestore().collection(collection).get()).docs.map((doc: DocumentSnapshot<any>) => doc.data());

      const result = items.map((item: any) => {

        const existingItem = this.findItemByNameAndBirthday(existingData, item);

        const assignedPlayer = this.findItemByNameAndBirthday(existingPlayerSnapshots.docs.map(doc => doc.data()), item);
        if (assignedPlayer) {
          item.assignedPlayerId = assignedPlayer.id;
          item.assignedPlayerTitle = getUserTitle(assignedPlayer);
        }

        // find assigned Senior
        if (collection === 'members') {

          const assignedSenior = this.findItemByNameAndBirthday(existingSeniorSnapshots.docs.map(doc => doc.data()), item);
          if (assignedSenior) {
            item.assignedSeniorId = assignedSenior.id; item.assignedSeniorTitle = getUserTitle(assignedSenior);
          }
        } else {
          const assignedMember = this.findItemByNameAndBirthday(existingMemberSnapshots.docs.map(doc => doc.data()), item);
          if (assignedMember) {
            item.assignedMemberId = assignedMember.id; item.assignedMemberTitle = getUserTitle(assignedMember);
          }
        }

        if (existingItem) {
          // check if data has changed
          // delete the following properties to not update the doc
          delete item.creation;
          delete item.modification;
          delete item.publication;
        }

        return { ...this.findItemByNameAndBirthday(existingData, item), ...item };
      });

      // to save only my account uncomment the following line
      // result = result.filter(m => m.firstName === 'Thomas' && m.lastName === 'Handle');

      await this.saveAllItems(collection, result);

      return items;
    } catch (e) {
      // console.error(e);
      return {
        error: e.message
      };
    }
  }

  private findItemByNameAndBirthday(itemList: (Senior | Member | Player)[], item: Senior | Member | Player): Senior | Member | Player {
    const found = itemList.find(p => p.firstName === item.firstName && p.lastName === item.lastName && p.birthDate === item.birthDate);
    // console.log(found);
    return found;
  }

  private async getSheetsAPI(): Promise<sheets_v4.Sheets> {
    return google.sheets({ version: 'v4', auth: this.getJwt() });
  }

  private getWorkbook(sheetsAPI: sheets_v4.Sheets, config: Config) {
    const APIKEY = config.googleSpreadSheetKey;
    return sheetsAPI.spreadsheets.get({
      // auth: jwt,
      key: APIKEY,
      spreadsheetId: config.googleDriveMemberSheet
    });
  }

  private getJwt() {
    return new google.auth.JWT(SERVICE_ACCOUNT.client_email, undefined, SERVICE_ACCOUNT.private_key, [
      'https://www.googleapis.com/auth/spreadsheets'
    ]);
  }

  private convert2jsMonthDay(value: any): string | null {
    const birthDate = this.convert2jsDate(value);
    if (birthDate) {
      return moment(birthDate).format('MM-DD');
    }
    return null;
  }

  private convert2jsDate(value: number /* , row?: any, type = 'other' */): number {
    if (value) {
      return moment(getJsDateFromExcel(value)).utc(true).valueOf();
    }
    return null;
  }


  private parseSeniorRow(row: any, user: User): Senior | null {

    // eslint-disable-next-line max-len
    const [salutation, lastName, firstName, streetName, streetNumber, zipCode, city, AHStatus, AHEntryDate, AHExitDate, AHFee, phoneNumber, cellNumber, email, birthDate, comment] = row;
    const timestamp = new Date().valueOf();
    let result: Senior;

    // eslint-disable-next-line max-len
    if (typeof (lastName) !== 'undefined' && typeof (firstName) !== 'undefined' && lastName.length > 0 && firstName.length > 0 && typeof this.convert2jsDate(birthDate) === 'number') {
      result = {
        gender: salutation === 'Herr' ? 'männlich' : 'weiblich',
        lastName,
        firstName,
        assignedPlayerId: null,
        assignedPlayerTitle: null,
        assignedMemberId: null,
        assignedMemberTitle: null,
        birthDate: this.convert2jsDate(birthDate),
        birthMonthDay: this.convert2jsMonthDay(birthDate),
        ahStatus: AHStatus || null,
        isImported: true,
        address: { streetName, houseNumber: streetNumber, zip: zipCode, city, county: 'Deutschland' },
        entryDate: this.convert2jsDate(AHEntryDate),
        exitDate: this.convert2jsDate(AHExitDate),
        fee: AHFee,
        contactData: { phoneHome: phoneNumber, phoneMobile: cellNumber, email },
        comment: comment || '',
        creation: { at: timestamp, by: 'System - GoogleDriveParser' },
        galleries: { Profilfotos: { title: 'Profilfotos' } },
        modification: [{ at: timestamp, by: 'System - GoogleDriveParser', changes: ['NEW'] }],
        // eslint-disable-next-line max-len
        publication: { at: new Date().valueOf(), by: user.id, status: 1, user: { assignedRoles: user.assignedRoles, displayName: getUserTitle(user), photoUrl: user.photoUrl } }
      };
      return result;
    }
    return null;
  }


  private parseMemberRow(row: any, user: User): Member | null {

    // eslint-disable-next-line max-len
    const [salutation, lastName, firstName, streetName, streetNumber, zipCode, city, title, clubStatus, clubEntryDate, clubExitDate, clubFee, phoneNumber, cellNumber, email, birthDate, tasks, comment] = row;
    const timestamp = new Date().valueOf();
    let result: Member;

    // eslint-disable-next-line max-len
    if (typeof lastName !== 'undefined' && typeof firstName !== 'undefined' && lastName.length > 0 && firstName.length > 0 && typeof this.convert2jsDate(birthDate) === 'number') { // typeof id !== 'undefined' &&
      result = {
        title: title || '',
        gender: salutation === 'Herr' ? 'männlich' : 'weiblich',
        lastName,
        firstName,
        birthDate: this.convert2jsDate(birthDate),
        birthMonthDay: this.convert2jsMonthDay(birthDate),
        clubStatus: clubStatus || null,
        isImported: true,
        // eslint-disable-next-line max-len
        address: { streetName: streetName || '', houseNumber: streetNumber || '', zip: zipCode || '', city: city || '', county: 'Deutschland' },
        entryDate: this.convert2jsDate(clubEntryDate),
        exitDate: this.convert2jsDate(clubExitDate),
        fee: clubFee || 0,
        contactData: { phoneHome: phoneNumber || '', phoneMobile: cellNumber || '', email: email || '' },
        galleries: { Profilfotos: { title: 'Profilfotos' } },
        tasks: tasks || '',
        comment: comment || '',
        creation: { at: timestamp, by: 'System - GoogleDriveParser' },
        modification: [{ at: timestamp, by: 'System - GoogleDriveParser', changes: ['NEW'] }],
        // eslint-disable-next-line max-len
        publication: { at: new Date().valueOf(), by: user.id, status: 1, user: { assignedRoles: user.assignedRoles, displayName: getUserTitle(user), photoUrl: user.photoUrl } }
      };
      return result;
    }
    return null;
  }

  private async saveAllItems(type: 'members' | 'seniors', items: (Senior | Member)[]) {
    const writeResults: any[] = [];
    const fb = admin.firestore();
    const maxWrite = 500;
    let result = false;

    do {
      const batch = fb.batch();
      const payload = items.splice(0, maxWrite);

      payload.forEach((m, n) => {
        if (m && m.birthDate) {
          if (!m.id) {
            const idRef = fb.collection(`${type}`).doc();
            m.id = idRef.id;
          }
          const ref = fb.doc(`${type}/${m.id}`);
          batch.set(ref, { ...m, id: m.id }, { merge: true });
        }
      });

      try {
        writeResults.push(...(await batch.commit()));
        result = true;
      } catch (error) {
        console.error(`[scrapGoogle - saveAll] ${type} writeresults`, writeResults);
        result = false;
      }

    } while (items.length > 0 && result);
  }

}
