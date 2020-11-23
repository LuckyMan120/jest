import { Member } from '@member/_interfaces/member.interface';
import { Player } from '@player/_interfaces/player.interface';
import { Senior } from '@senior/_interfaces/senior.interface';
import { User } from '@user/_interfaces/user.interface';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';
import { getUserTitle } from './../../../app-functions';
import { PlayerGR } from './../../_interfaces/player-gr.interface';
import { DfbnetScrapper } from './dfbnetScrapper';
import { PlayerFactory } from './player.factory';

export class DfbnetImporter {

  public static predefinedFields = [
    'ageGroup', 'firstName', 'lastName', 'birthDate', 'friendlyMatches',
    'gender', 'guestPlayer', 'homeClub', 'isImported', 'officialMatches',
    'passNumber', 'passPrint', 'playerStatus', 'signOut', 'status'
  ];

  public static async import(
    dfbnetUser: string,
    dfbnetPass: string,
    author: User,
    baseUrl?: string)
    : Promise<{
      updatedUsers: number,
      newUsers: number,
      playersList: PlayerGR[]
    }> {

    let players: Player[];

    let updatedUsers = 0;
    let newUsers = 0;

    // const user = dfbnetUser || process.env.dfbnetUser;
    // const pass = dfbnetPass || process.env.dfbnetPass;

    const fb = admin.firestore();
    const scraper = new DfbnetScrapper(dfbnetUser, dfbnetPass, baseUrl);
    // console.log(dfbnetUser, dfbnetPass, baseUrl);
    const playersGR: PlayerGR[] = await scraper.scrape();

    players = playersGR.map(p => PlayerFactory.fromPlayerGR(p, author));
    // console.log(players.length, 'players');

    const existingMemberSnapshots = await fb.collection('members').get();
    const existingMembers = existingMemberSnapshots.docs.map(item => item.data() as Member);
    const existingSeniorSnapshots = await fb.collection('seniors').get();
    const existingSeniors = existingSeniorSnapshots.docs.map(item => item.data() as Senior);

    players = players.map(player => this.getAssignedMemberAndSenior(player, existingMembers, existingSeniors));

    const promises = players.map(p => fb.doc(`players/${p.passNumber}`).get());
    const playersInFs = await Promise.all(promises);

    const playersList: Player[] = players.map(p => p);
    // console.log(playersList.length, 'PlayersList');

    players = playersInFs.map(entry => {

      const newPlayerData = players.find(p => p.passNumber + '' === entry.id);

      if (entry.exists) { // entry exists and data has changed? return player else return undefined
        const dataHasChanged = this.playerDataHasChanged(entry.data() as Player, newPlayerData);
        if (dataHasChanged) {
          updatedUsers++;
          return dataHasChanged;
        }
        return entry.data() as Player;
      } else { // new entry
        newUsers++;
        return players.find(p => p.passNumber + '' === entry.id);
      }
    }).filter(x => !!x);

    // to save only my account uncomment the following line
    // players = players.filter(m => m.firstName === 'Thomas' && m.lastName === 'Handle');

    const writeResults: any[] = [];
    const maxWrite = 500;
    let result = false;
    do {
      const batch = fb.batch();
      const payload = players.splice(0, maxWrite);

      payload.forEach(m => {
        const ref = fb.doc(`players/${m.passNumber}`);
        batch.set(ref, { ...m }, { merge: true });
      });
      try {
        writeResults.push(...(await batch.commit()));
        result = true;
      } catch (error) {
        console.error('[scrapFussball - saveAllMatches] writeresults', writeResults);
        result = false;
      }
    } while (players.length > 0 && result);

    return {
      newUsers,
      updatedUsers,
      playersList
    };
  }


  public static playerDataHasChanged(existingPlayer: Player, newPlayer: Player): Player | undefined {

    const savedPlayer = { ...existingPlayer };

    ['creation', 'publication', 'modification'].map(prop => {
      delete (existingPlayer as any)[prop];
      delete (newPlayer as any)[prop];
    });

    const comparison = _.reduce(existingPlayer, (result, value, key) => {
      return _.isEqual(value, (newPlayer as any)[key]) ?
        result : result.concat(key);
    }, []);

    if (comparison && this.predefinedFields.some((fieldName: string) => comparison.includes(fieldName))) {
      const combinedObject = Object.assign({}, savedPlayer, newPlayer);
      const changedValues = {};

      const changes = comparison.map(field => (changedValues as any)[field] = {
        oldValue: savedPlayer[field] || null,
        newValue: newPlayer[field] || null
      }
      );
      combinedObject.modification?.push({ at: new Date().valueOf(), by: 'System - GoogleDriveParser', changes });
      return combinedObject;
    }

    return undefined;
  }

  private static getAssignedMemberAndSenior = (p: Player, mList: Member[], sList: Senior[]): Player => {
    const assignedMember = mList.find(m => m.firstName === p.firstName && m.lastName === p.lastName && m.birthDate === p.birthDate);
    if (assignedMember) {
      p.assignedMemberId = assignedMember.id;
      p.assignedMemberTitle = getUserTitle(assignedMember);
    }

    const assignedSenior = sList.find(m => m.firstName === p.firstName && m.lastName === p.lastName && m.birthDate === p.birthDate);
    if (assignedSenior) {
      p.assignedSeniorId = assignedSenior.id;
      p.assignedSeniorTitle = getUserTitle(assignedSenior);
    }
    return p;
  }

}
