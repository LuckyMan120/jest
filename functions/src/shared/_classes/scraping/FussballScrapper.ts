import { Match } from '@match/_interfaces/match.interface';
import { Team } from '@team/_interfaces/team.interface';
import * as htmlEntities from 'html-entities';
import * as JSSoup from 'jssoup';
import * as moment from 'moment';
import * as rp from 'request-promise';
const Entities = htmlEntities.Html5Entities;
moment.locale('de');

export class FussballScrapper {

  private url: string;
  private currentDate!: moment.Moment;

  constructor(id: string, startDate: Date, endDate: Date) {
    const start = moment(startDate).format('YYYY-MM-DD');
    const end = moment(endDate).format('YYYY-MM-DD');
    // eslint-disable-next-line max-len
    this.url = this.url = `http://www.fussball.de/ajax.club.matchplan/-/id/${id}/mime-type/HTML/mode/PAGE/show-filter/false/max/9999/datum-von/${start}/datum-bis/${end}/show-venues/checked/offset/0`;
  }

  public async scrape() {
    console.log('[FussballScrapper - scrape] requesting web page ...');
    let html: string = await rp(this.url);
    console.log('[FussballScrapper - scrape] web page loaded');
    const entities = new Entities();
    console.log('[FussballScrapper - scrape] decoding web page content ...');
    html = entities.decode(html);
    console.log('[FussballScrapper - scrape] web page content decoded');
    return this.parse(html);
  }

  private parse(html: string): Match[] {
    const result: Match[] = [];
    console.log('[FussballScrapper - scrape] JSoupong web page content ...');
    // eslint-disable-next-line new-cap
    const soup = new JSSoup.default(html);
    console.log('[FussballScrapper - scrape] web page content jsouped');
    const table = soup.find('table');
    if (table) {
      const tableRows = table.findAll('tr', ['row-competition']);
      console.log('[FussballScrapper - scrape] parsing table rows', tableRows.length);
      tableRows.forEach((tr: JSSoup.SoupTag) => {
        const match: Match = this.parseMatchRow(tr);
        result.push(match);
      });
    }
    return result;
  }

  private parseMatchRow(tr: JSSoup.SoupTag): Match {
    const match: Match = {
      id: '',
      rawHTML: tr.toString(),
      matchStartDate: 0,
      result: { otherEvent: null, homeTeamGoals: null, guestTeamGoals: null }
    };

    const columnDate = tr.find('td', 'column-date');
    const now = new Date().valueOf();
    match.creation = {
      at: now,
      by: 'System - MatchParser'
    };
    match.modification = [
      {
        at: now,
        by: 'System - MatchParser',
        changes: ['NEW']
      }
    ];
    match.publication = {
      at: now,
      by: 'System - MatchParser',
      status: 1
    };

    match.matchStartDate =
      this.parseDate(columnDate)
        .toDate()
        .valueOf() || undefined;

    const columnTypes = tr.find('td', 'column-team');
    [match.playersType, match.matchType] = this.parseMatchTypes(columnTypes);

    // added TH
    if (match.playersType === 'Ü32 Senioren') {
      match.playersType = 'Altherren-A Ü32';
    }
    // added TH - get MatchEndDate
    match.matchEndDate = this.setMatchEndDate(match.playersType, match.matchStartDate);

    const [twoLetters, matchId] = columnTypes.nextSibling.text.split(' | ');
    match.matchId = matchId;
    match.id = matchId;
    match.isOfficialMatch = true;
    match.twoLetter = twoLetters || null;

    const tr2 = tr.nextSibling;
    if (tr2) {
      const [homeTeam, guestTeam] = tr2.findAll('td', 'column-club');
      match.homeTeam = this.parseTeam(homeTeam, match.playersType) as any;
      match.guestTeam = this.parseTeam(guestTeam, match.playersType) as any;
    }
    match.matchLink = tr2.find('td', 'column-detail').nextElement.attrs.href || null;

    match.isCompleted = false;

    const tr3 = tr2.nextSibling;
    if (tr3 && tr3.attrs && tr3.attrs.class && tr3.attrs.class.indexOf('row-venue') > -1) {
      match.location = tr3.text.trim() || null;
    }
    match.isImported = true;
    return match;
  }

  private parseDate(td: JSSoup.SoupTag): moment.Moment {
    let sDate: string = td.text;
    let date: moment.Moment;
    // moment.tz.setDefault('Europe/Berlin');
    if (td.contents.length > 1) {
      sDate = td.contents[0].text.replace('|', '').trim() + ` ${td.contents[1].toString()}`;
      date = moment(sDate, 'DD.MM.YY HH:mm');
      this.currentDate = date;
      // console.log(`[FussballScrapper - scrape] ${td.contents[1].toString()} --> ${date}` );
    } else {
      const [hour, min] = sDate.split(':');
      date = moment(this.currentDate);
      date.hours(+hour);
      date.minutes(+min);
      // console.log(` [FussballScrapper - scrape] ${sDate} <--> ${date}` );
    }
    return date;
  }

  private parseMatchTypes(td: JSSoup.SoupTag): [string, string] {
    return td.text ? td.text.split(' | ') : ['', ''];
  }

  private parseTeam(td: JSSoup.SoupTag, playerType: string): Team | 'spielfrei' {
    const a = td.find('a');
    if (a) {
      const clubName = a.find('div', 'club-name');
      const clubLogo = a.find('div', 'club-logo');
      const clubLogoNext = clubLogo ? clubLogo.nextElement : undefined;
      const team: Team = {
        galleries: {
          Mannschaftsfotos: {
            title: 'Mannschaftsfotos'
          }
        },
        externalTeamLink: a.attrs ? a.attrs.href : undefined,
        id: this.findIdInURI(a.attrs.href),
        title: clubName.text ? clubName.text.trim() : undefined,
        assignedCategoryIds: [playerType],
        logoURL: clubLogoNext.attrs ? 'https:' + clubLogoNext.attrs['data-responsive-image'] : undefined
      };
      return team || null;
    } else {
      return 'spielfrei';
    }
  }

  private findIdInURI(uri: string, token: string = 'team-id'): string | undefined {
    const parts = uri.split('/');
    const index = parts.indexOf(token);
    if (index > -1 && parts.length > index + 1) {
      return parts[index + 1];
    } else {
      return undefined;
    }
  }

  // added TH
  private setMatchEndDate(playersType: string, startDate: number | undefined) {
    if (!startDate) {
      return undefined;
    }
    let endDate: number;
    switch (playersType) {
      case 'Altherren-A Ü32':
      case 'Altherren-B Ü40':
      case 'Altherren-C Ü50':
      case 'Altherren-D Ü60':
        endDate = startDate + 80 * 1000 * 60; // 2*35 min + 10 min pause
        break;
      case 'Herren':
      case 'Frauen':
        endDate = startDate + 105 * 1000 * 60; // 2*45 min + 15 min pause
        break;
      case 'A-Junioren':
        endDate = startDate + 105 * 1000 * 60; // 2*45 min + 15 min pause
        break;
      case 'B-Junioren':
        endDate = startDate + 95 * 1000 * 60; // 2*40 min + 15 min pause
        break;
      case 'C-Junioren':
        endDate = startDate + 80 * 1000 * 60; // 2*35 min + 10 min pause
        break;
      case 'D-Junioren':
        endDate = startDate + 70 * 1000 * 60; // 2*30 min + 10 min pause
        break;
      case 'E-Junioren':
        endDate = startDate + 60 * 1000 * 60; // 2*25 min + 10 min pause
        break;
      case 'F-Junioren':
        endDate = startDate + 45 * 1000 * 60; // 2*20 min + 5 min pause
        break;
      case 'G-Junioren':
        endDate = startDate + 35 * 1000 * 60; // 2*15 min + 5 min pause
        break;
      default:
        console.error(playersType);
        console.error('start --> ' + moment(startDate).toDate());
        // console.log('[FussballScrapper - scrape] ende -->' + moment(endDate).toDate());
        endDate = startDate;
        break;
    }
    return endDate;
  }
}
