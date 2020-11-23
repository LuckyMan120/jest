import { Location } from '@location/_interfaces/location.interface';
import { Match } from '@match/_interfaces/match.interface';
import { Team } from '@team/_interfaces/team.interface';
import * as admin from 'firebase-admin';
import * as moment from 'moment';
import { FussballScrapper } from './FussballScrapper';
import { LocationParser } from './locationParser';
import { MatchCategoryParser } from './matchCategoryParser';
import { StandingScrapper } from './StandingScrapper';
import { TeamParser } from './TeamParser';
moment.locale('de');

export class FussballImporter {

  /** added TH */
  async importStandings() {
    console.error('[scrapStandings - importStandings] get season');
    const now = moment().format('YYYY-MM-DD');
    const seasons = await admin.firestore().collection(`seasons`).where('startDate', '<=', now).get();
    const currentSeason = seasons.docs.find(season => season.data().endDate >= now);

    console.error('[scrapStandings - importStandings] get teams for season', currentSeason?.data().title);
    // eslint-disable-next-line max-len
    const teams = await admin.firestore().collection(`teams`).where('assignedSeasonId', '==', currentSeason?.id).where('isOfficialTeam', '==', true).where('isSignedOut', '==', false).limit(1).get();

    const Scrapper = new StandingScrapper();
    const teamLinks = teams.docs.map(doc => (doc.data() as Team)?.externalTeamLink);
    const teamPromises = teamLinks.map(link => Scrapper.scrape(link));
    const result = await Promise.all(teamPromises);
    return { season: currentSeason?.data().title, teams: result };
  }

  async import(
    startDateParam: moment.Moment,
    endDateParam: moment.Moment,
    id: string
  ): Promise<Match[]> {
    const colSnapshots = ['locations', 'matches', 'teams'].map(col => admin.firestore().collection(col).get());
    const promises = await Promise.all(colSnapshots);
    const deletePromises = promises.map(pr => pr.docs.map(doc => doc.ref.delete()));
    await Promise.all(deletePromises);

    const scrapper = new FussballScrapper(id, moment(startDateParam, 'YYYY-MM-DD').toDate(), moment(endDateParam, 'YYYY-MM-DD').toDate());
    const result: Match[] | undefined[] = await scrapper.scrape();

    if (result.length > 0) {

      let location: Location | undefined;
      let n = 0;
      let i = 0;

      const teamParser = new TeamParser();
      await teamParser.init();

      while (n < 9999999 && i < result.length) {
        console.log(`Processing ${i}`);

        const rawLoc = result[i].location;
        if (rawLoc && rawLoc !== '') {
          location = await new LocationParser(rawLoc).getLocation();
          result[i].assignedLocationId = location?.id;
          result[i].assignedLocationTitle = location?.title;
          n++;
        }

        result[i].assignedCategoryIds = [];
        result[i].assignedCategoryTitles = [];
        const assignedCategories = await new MatchCategoryParser(result[i].playersType).getCategories();
        assignedCategories.forEach((assignedCategory: { id: string, title: string }) => {
          result[i]?.assignedCategoryIds?.push(assignedCategory.id);
          result[i]?.assignedCategoryTitles?.push(assignedCategory.title);
        });
        result[i] = await teamParser.parseTeams(result[i]) as any;
        i++;
      }
      // result = result.filter(m => !!m && m.guestTeam !== 'spielfrei' && m.homeTeam !== 'spielfrei');
      // await this.saveAllMatches(result);
    }
    return result;
  }

  async saveAllMatches(matches: Match[]): Promise<boolean> {
    let result = false;
    const writeResults: any[] = [];
    try {
      const _matches = [...matches];
      const fb = admin.firestore();
      const maxWrite = 500;
      do {
        const batch = fb.batch();
        const payload = _matches.splice(0, maxWrite);
        payload.forEach(m => {
          if (m.assignedTeamTitle) { // m.location &&
            // T.H. 22/05/20 - save Match, even if no location is set -> for canceled matches etc
            // if (!!m && m.guestTeam !== 'spielfrei' && m.homeTeam !== 'spielfrei') {
            const ref = fb.doc(`matches/${m.id}`);
            batch.set(ref, { ...m }, { merge: true });
          }
          // }
        });
        try {
          writeResults.push(...(await batch.commit()));
          result = true;
        } catch (error) {
          console.error('[scrapFussball - saveAllMatches] writeresults', writeResults);
          result = false;
        }
      } while (_matches.length > 0 && result);
    } catch (e) {
      console.error(
        '[scrapFussball - saveAllMatches] error:',
        { matches, writeResults },
        e
      );
      result = false;
    }
    return Promise.resolve(result);
  }

}
