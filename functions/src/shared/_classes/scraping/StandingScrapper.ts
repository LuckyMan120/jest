import * as axios from 'axios';
import * as HtmlEntities from 'html-entities';
import JSSoup from 'jssoup';
import * as moment from 'moment';
const Entities = HtmlEntities.Html5Entities;
moment.locale('de');

export class StandingScrapper {

  constructor() {
  }

  public async scrape(url?: string): Promise<any> {
    if (!url || url === '') {
      console.log('[StandingScrapper - scrape] NO URL given ...');
      return;
    }
    console.log('[StandingScrapper - scrape] requesting web page ... ' + url);
    let html = (await axios.default.get(url)).data;
    console.log(html);
    console.log('[StandingScrapper - scrape] web page loaded');
    const entities = new Entities();
    console.log('[StandingScrapper - scrape] decoding web page content ...');
    html = entities.decode(html);
    console.log('[StandingScrapper - scrape] web page content decoded');
    return url ? this.parseRoundStandings(html) : this.parse(html);
  }

  private parseRoundStandings(html: string): any {
    console.log(html);
    console.log('..........................................................');
    const result: any = [];
    console.log('[StandingScrapper - scrape] JSouping standing page content ...');
    // eslint-disable-next-line new-cap
    const soup = new JSSoup.default(html);
    console.log('[StandingScrapper - scrape] standing page content jsouped ');
    const tables = soup.findAll('table');
    if (tables) {
      tables.forEach((table: JSSoup.SoupTag) => {

        let tableTitle = '';
        if (table.find('tr', ['row-headline', 'primary'])) {
          tableTitle = table.find('tr', ['row-headline', 'primary']).nextElement.text;
        }
        const tbody = table.find('tbody');
        const tableRows = tbody.findAll('tr');
        if (tableRows) {
          console.log(3);
          const standings: any = [];
          tableRows.forEach((tr: JSSoup.SoupTag) => {
            const standingRow = this.parseStandingRow(tr);
            standings.push(standingRow);
          });
          result.push({
            standings,
            title: tableTitle
          });
        }
      });
    }
    return result;
  }

  private async parse(html: string): Promise<any> {
    const result: any = {};
    console.log('[StandingScrapper - scrape] JSoupong web page content ...');
    // eslint-disable-next-line new-cap
    const soup = new JSSoup.default(html);
    console.log('[StandingScrapper - scrape] web page content jsouped');
    const topWrapper = soup.find('div', 'stage-content-wrapper');
    console.log('[StandingScrapper - scrape] scraping team image');
    const teamImage = topWrapper.find('img');
    result.imageUrl = teamImage.attrs.src;

    console.log('[StandingScrapper - scrape] scraping team infos');
    const teamInfo: any = {};
    let savedValue: string;
    const innerDiv = topWrapper.findAll('div', 'inner');
    if (innerDiv) {
      innerDiv[1].contents.forEach((el: JSSoup.SoupTag) => {
        if (el.attrs.class === 'profile-value') {
          savedValue = el.text;
        }
        if (el.attrs.class === 'profile-label') {
          teamInfo[el.text] = savedValue;
        }
      });
    }
    result.teamInfo = teamInfo;

    const ticker: any = [];
    console.log('[StandingScrapper - scrape] scraping team news-ticker');
    const tickerTable = soup.find('table', ['ticker', 'table', 'table-striped', 'table-full-width']);
    if (tickerTable) {
      const tableRows = tickerTable.findAll('tr');
      tableRows.forEach((tr: JSSoup.SoupTag) => {
        const link = tr.find('td', ['column-link', 'no-border', 'hidden-small']);
        if (link) {
          const news: any = {};
          news.link = link.nextElement.nextElement.attrs.href;
          const newsDate = tr.find('td', ['column-date', 'no-border', 'hidden-small']).nextElement.nextElement.text;
          news.publicationDate = newsDate; // moment(newsDate, "DD.MM.YYYY").unix();
          news.title = tr.find('td', ['column-name', 'no-border', 'hidden-small']).nextElement.nextElement.text;
          ticker.push(news);
        }
      });
    }
    result.ticker = ticker;

    console.log('[StandingScrapper - scrape] scraping team competitions');
    const competitionsDiv = soup.find('div', 'team-competitions');
    if (competitionsDiv) {
      const teamCompetitions: any = [];
      competitionsDiv.findAll('a').forEach((el: JSSoup.SoupTag) => {
        teamCompetitions.push({
          link: el.attrs.href,
          title: el.text
        });
      });
      result.competitions = teamCompetitions;
    }

    console.log('[StandingScrapper - scrape] scraping team standings');
    const standings: any = [];
    const fixturesDiv = soup.find('div', ['table-container', 'fixtures-league-table']);
    if (fixturesDiv) {
      const tableBody = fixturesDiv.find('tbody');
      if (tableBody) {
        const tableRows = tableBody.findAll('tr');
        tableRows.forEach((tr: JSSoup.SoupTag) => {
          const standingRow = this.parseStandingRow(tr);
          standings.push(standingRow);
        });
      }
    }
    result.standings = standings;

    if (fixturesDiv) {
      console.log('[StandingScrapper - scrape] get link for first / back round');
      const roundUrl = fixturesDiv.previousSibling.nextElement.nextElement.nextElement.nextElement.nextSibling.nextElement.attrs.href;
      result.roundStandings = await this.scrape(roundUrl);
      console.log('[StandingScrapper - scrape] get link for home / away table');
      // eslint-disable-next-line max-len
      const homeAwayUrl = fixturesDiv.previousSibling.nextElement.nextElement.nextElement.nextElement.nextSibling.nextSibling.nextElement.attrs.href;
      result.homeAwayStandings = await this.scrape(homeAwayUrl);
    }
    return result;
  }

  private parseStandingRow(tr: JSSoup.SoupTag): any {
    const standing: any = {};

    const iconCol = tr.find('td', 'column-icon');
    if (iconCol) {
      const icon = tr.find('td', 'column-icon').nextElement.attrs.class;
      switch (icon) {
        case 'icon-arrow-up-right': standing.icon = 'fas fa-arrow-up'; break;
        case 'icon-arrow-right': standing.icon = 'fas fa-arrow-right'; break;
        case 'icon-arrow-down-right': standing.icon = 'fas fa-arrow-down'; break;
      }
    }

    standing.rank = tr.find('td', 'column-rank').text.trim();

    const club = tr.find('td', 'column-club');
    standing.clubLink = club.nextElement.attrs.href;
    standing.clubLogo = club.nextElement.find('img').attrs.src;
    standing.clubTitle = club.nextElement.find('div', 'club-name').text.trim();
    standing.matches = club.nextSibling.text;
    standing.won = club.nextSibling.nextSibling.text;
    standing.draw = club.nextSibling.nextSibling.nextSibling.text;
    standing.loss = club.nextSibling.nextSibling.nextSibling.nextSibling.text;
    standing.goalDiff = club.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.text;
    standing.goalRatio = club.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.text;
    standing.points = club.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.text;

    return standing;

  }

}
