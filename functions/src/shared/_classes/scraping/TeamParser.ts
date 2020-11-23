import { Match } from '@match/_interfaces/match.interface';
import { Config } from '@shared/_interfaces/config.interface';
import { Season } from '@shared/_interfaces/season.interface';
import { Team } from '@team/_interfaces/team.interface';
import * as admin from 'firebase-admin';
import { NotificationEngine } from '../notification-engine';
import { SeasonManager } from './seasonManager';
import util = require('util');

export class TeamParser {
  protected fs = admin.firestore();
  protected isHome = true;
  protected COMMUNITIES: string[] = [];
  protected match: Match | undefined;

  public async init() {
    if (!this.COMMUNITIES || this.COMMUNITIES.length === 0) {
      this.COMMUNITIES = ((await this.fs.doc(`config/1`).get()).data() as Config).communities;
    }
  }

  public async parseTeams(match: Match): Promise<Match | undefined> {
    this.match = match;
    let title: string | undefined;
    let howManyTeams = 0;
    let team1!: Team | undefined;
    let team2!: Team | undefined;

    // First we try with the Home Team and
    // we check if ir is actually a Team, and not a string
    title = (this.match.homeTeam as Team).title;

    // Then we parse the Match to find the corresponding Team for homeTeam
    this.isHome = true;
    team1 = await this._parseTeam(title);
    if (team1 && !!team1.id) { // .assignedTeamId
      howManyTeams++;
    }

    // if result1 is undefined, it means we don't want to save the match
    // so we skip searching for guestTeam

    if (team1) {
      // Next, we try with the Guest Team and
      // we also check if it is actually a Team, and not a string
      this.isHome = false;
      title = (this.match.guestTeam as Team).title;
      team2 = await this._parseTeam(title);
      if (team2 && !!team2.id) {
        howManyTeams++;
      }

      // if result2 is undefined, it means we don't want to save the match,
      // so we set result1 to undefined to implicitly set match to undefined,
      // in the first case of the switch
      if (!team2) {
        team1 = undefined;
        this.match = undefined;
      }
    }

    switch (howManyTeams) {
      case 1:
        this.match.assignedTeamId = team1 && !!team1.id ? team1.id : team2.id;
        break;

      case 0:
        if (this.match) { // added TH
          await NotificationEngine.notifyNewMatch(this.match, 'No team found', true);
        }
        break;

      default:
        // more than 1
        if (this.match) { // added TH
          await NotificationEngine.notifyNewMatch(this.match, '2 matching teams found', true);
        }
        break;
    }
    return Promise.resolve(this.match);
  }

  protected async _parseTeam(teamName: string | undefined): Promise<Team | undefined> {
    if (!teamName) {
      return undefined;
    }
    const result: any = {}; // { ...this.match } as Team
    // result.assignedTeamId = undefined;

    try {
      // First we check if parameter is ok
      if (teamName) {
        // Then, we check if it matches at least one of the COMMUNITIES:
        const subTitle = this.COMMUNITIES.find(c => teamName.trim().includes(c.trim()));

        // If it checks out, we try to find a matching Team in the teams collection
        // If not, we return null.
        if (subTitle) {
          const assignedTeamObject: Team | undefined = await this.findTeam(teamName, this.match?.playersType);
          if (assignedTeamObject) {
            result.assignedTeamId = assignedTeamObject.id;
            result.assignedTeamTitle = assignedTeamObject.title;
            result.isHomeTeam = this.isHome;
            if (this.isHome) {
              result.homeTeam = {};
              (result.homeTeam as Team).title = assignedTeamObject.subTitle;
            } else {
              result.guestTeam = {};
              (result.guestTeam as Team).title = assignedTeamObject.subTitle;
            }
          }
          if (assignedTeamObject && assignedTeamObject.isSignedOut) {
            return undefined;
          }
        }
      }
    } catch (e) {
      console.error('[TeamParser-_parseTeams] with teamName', teamName, e);
    }
    return result;
  }

  protected async findTeam(subTitle: string, playerType: string | undefined): Promise<Team | undefined> {
    let result!: Team | undefined;
    let isSignedOut = false;
    try {
      // First we check if we have valid parameters
      if (!!subTitle || !!playerType) {
        let newTeamName = subTitle;
        // We check if the team is signedOut for this season:
        if (subTitle.slice(-3).toLowerCase() === 'zg.') {
          isSignedOut = true;
          newTeamName = subTitle.slice(0, -3).trim();
        }
        // Then We retrieve the current season
        // If it doesn't exist, we create it and save it
        const currentSeason: Season | undefined = await new SeasonManager().getCurrentSeason();

        // We search the DB for a matching team
        const docsRef = await this.fs
          .collection('teams')
          .where('subTitle', '==', newTeamName)
          .where('title', '==', playerType)
          .get();

        // We check if we have found at least one Team
        if (docsRef.size > 0) {
          // If true, we check if a team for the current season exists.
          const _team = docsRef.docs.find(team => {
            const t = team.data() as Team;
            return t.assignedSeasonId === currentSeason?.id;
          });
          result = !!_team ? (_team.data() as Team) : undefined;
          if (!result) {
            // We have some matching teams, but not from the current season
            // So we create a new Team, with the newly created season
            result = await this.createTeamAndSaveTeam(currentSeason, isSignedOut);
          } else {
            // we have found the team (assuming that 2 teams can't have the same season)
            // Now we have to update if they have signed out or not.
            if (isSignedOut && !result.isSignedOut) {
              result.isSignedOut = isSignedOut;
              await this.fs.doc(`teams/${result.id}`).set(result, { merge: true });
            }
            console.log('[TeamParser - findTeam] - Found 1 team for', subTitle);
          }
        } else {
          // no matching team, creating one and notifying
          result = await this.createTeamAndSaveTeam(currentSeason, isSignedOut);
          console.log('[TeamParser - findTeam] - no matching team for', subTitle);
        }
      }
    } catch (e) {
      console.error('[TeamParser-findTeam] with params', { subTitle, playerType }, e);
    }
    return result;
  }

  protected async createTeamAndSaveTeam(season: Season | undefined, isSignedOut: boolean): Promise<Team | undefined> {
    let result!: Team;
    try {
      // const findSeason = await this.fs.collection('seasons').doc(season.id).get();
      const timestamp = new Date().valueOf();
      result = {
        id: this.fs.collection('teams').doc().id,
        isValid: false,
        isSignedOut,
        assignedSeasonId: season?.id,
        assignedSeasonTitle: season?.title,
        assignedPlayerIds: [],
        assignedPlayerTitles: [],
        assignedCategoryIds: this.match?.assignedCategoryIds,
        assignedCategoryTitles: this.match?.assignedCategoryTitles,
        galleries: { Mannschaftsfotos: { title: 'Mannschaftsfotos' } },
        externalTeamLink: this.isHome ? (this.match?.homeTeam as Team).externalTeamLink : (this.match?.guestTeam as Team).externalTeamLink,
        isOfficialTeam: true,
        logoURL: this.isHome ? (this.match?.homeTeam as Team).logoURL : (this.match?.guestTeam as Team).logoURL,
        title: this.match?.playersType || '',
        subTitle: this.getTeamName(this.match, this.isHome, isSignedOut),
        isImported: true,
        creation: { by: 'System - TeamParser', at: timestamp },
        modification: [{ at: timestamp, by: 'System - TeamParser', changes: ['NEW'] }],
        publication: { at: timestamp, by: 'System - TeamParser', status: 1 }
      };
      const saved = await this.fs.doc(`teams/${result.id}`).set(result);
      if (saved && saved.writeTime.seconds > 0) {
        await NotificationEngine.notifyNewTeam(result, 'newTeam');
      }
    } catch (e) {
      console.error(
        '[TeamParser - createTeamAndSaveTeam] with params',
        // { season: season, isSignedOut: isSignedOut, isHome: this.isHome },
        util.inspect(result),
        e
      );
      // result = undefined;
      return undefined;
    }
    return Promise.resolve(result);
  }

  protected getTeamName(match: Match | undefined, isHome: boolean, isSignedOut: boolean) {
    if (!match) {
      return undefined;
    }
    let result = isHome ? (match?.homeTeam as Team)?.title?.trim() : (match?.guestTeam as Team)?.title?.trim();
    result = isSignedOut ? result?.slice(0, -3).trim() : result;
    return result;
  }

}
