import { Season } from '@shared/_interfaces/season.interface';
import * as admin from 'firebase-admin';
import * as moment from 'moment';
import { NotificationEngine } from '../../_classes/notification-engine';
moment.locale('de');

export class SeasonManager {
  protected fs: FirebaseFirestore.Firestore;

  constructor() {
    this.fs = admin.firestore();
    // moment.tz.setDefault('Europe/Berlin');
  }

  public async getCurrentSeason(): Promise<Season | undefined> {
    const { startDate, endDate } = this.getSeasonStartAndEndDate();
    const season = await this.getSeasonFromDB(startDate, endDate);
    if (season) {
      return Promise.resolve(season);
    } else {
      return await this.createAndSaveNewSeason(startDate, endDate);
    }
  }

  private getSeasonStartAndEndDate(): { startDate: moment.Moment; endDate: moment.Moment } {
    let start: moment.Moment;
    let end: moment.Moment;
    const currentDate = moment();
    if (currentDate.month() < 6) {
      start = moment([currentDate.year() - 1, 6]).startOf('month');
      // .toDate();
      end = moment([currentDate.year(), 5]).endOf('month');
      // .toDate();
    } else {
      start = moment([currentDate.year(), 6]).startOf('month');
      // .toDate();
      end = moment([currentDate.year() + 1, 5]).endOf('month');
      // .toDate();
    }

    return { startDate: start, endDate: end };
  }

  private async getSeasonFromDB(startDate: moment.Moment, endDate: moment.Moment): Promise<Season | undefined> {
    const snap = await this.fs
      .collection('seasons')
      .where('startDate', '==', startDate.format('YYYY-MM-DD'))
      .where('endDate', '==', endDate.format('YYYY-MM-DD'))
      .get();
    if (snap && snap.size > 0) {
      return snap.docs[0].data() as Season;
    } else {
      return undefined;
    }
  }

  public async createAndSaveNewSeason(startDate: moment.Moment, endDate: moment.Moment): Promise<Season> {
    const timestamp = new Date().valueOf();
    let season: Season = {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      isImported: true,
      creation: {
        by: 'System - SeasonParser',
        at: timestamp
      },
      modification: [
        {
          at: timestamp,
          by: 'System - SeasonParser',
          changes: ['NEW']
        }
      ]
    };

    try {
      season = {
        ...season,
        id: `Saison ${moment(startDate).year()}-${moment(endDate).year()}`,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        description: `Alle Informationen zur Saison ${moment(startDate).year()}/${moment(endDate).year()}`,
        title: `Saison ${moment(startDate).year()}/${moment(endDate).year()}`,
        isImported: true
      };

      const result = await this.fs.doc(`seasons/${season.id}`).set(season, { merge: true });
      if (!result || !result.writeTime) {
        throw new Error('sometinhg wrong happened');
      } else {
        await NotificationEngine.notifyNewSeason(season);
      }
    } catch (e) {
      console.error('[SeasonManager - createAndSaveNewSeason]', e);
      return Promise.reject(e);
    }
    return Promise.resolve(season);
  }
}
