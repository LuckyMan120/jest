import * as csvjson from 'csvjson';
import * as JSSoup from 'jssoup';
import { CookieJar } from 'request';
import * as rp from 'request-promise';
import { PlayerGR } from './../../_interfaces/player-gr.interface';

export class DfbnetScrapper {
  protected jar: CookieJar;

  constructor(
    protected user: string,
    protected password: string,
    protected baseURL: string = 'https://www.dfbnet.org'
  ) {
    this.jar = rp.jar();
  }

  protected async login() { // user: string, pass: string
    const options: rp.RequestPromiseOptions = {
      method: 'POST',
      jar: this.jar,
      form: {
        event: 'NEW',
        UN: this.user, // user ||
        PW: this.password, // password ||
        submit: 'Anmelden'
      },
      simple: false
    };
    const resp: string = await rp(`${this.baseURL}/spielplus/authenticate.do`, options);

    const start = resp.search('var dfbMenuJsonData') + 22;
    const end = resp.indexOf('];', start);
    const code = resp.slice(start, end + 1);
    const dfbMenuJsonData: [any] = JSON.parse(code);
    const passOnlineObj = dfbMenuJsonData.find(o => o.label === 'Pass Online');
    return this.baseURL + passOnlineObj.href;
  }

  protected async passOnline(uri: string) {
    const resp: string = await rp(uri, { jar: this.jar });

    const start = resp.search('var dfbMenuJsonData') + 22;
    const end = resp.indexOf('];', start);
    const code = resp.slice(start, end + 1);
    const dfbMenuJsonData: [any] = JSON.parse(code);
    const passOnlineObj = dfbMenuJsonData.find(o => o.label === 'Pass Online');
    const spierlerlist = passOnlineObj.subNav.find((o: any) => o.label === 'Spielerliste');
    return this.baseURL + spierlerlist.href;
  }

  protected async spielerListe(uri: string) {
    return await rp(uri, { jar: this.jar });
  }

  protected async spielerListeErstellen() {
    const options = {
      jar: this.jar,
      method: 'POST',
      form: {
        event: 'SUCHEN',
        _kontext: {
          vereinSearchParameter: `Sportfreunde Winterbach / ${this.user.split('-')[0]}`
        },
        kontext: {
          selectedId: null,
          spielerArt: 0,
          suche: {
            altersklasseId: null,
            geschlecht: null,
            art: 1
          },
          einsetzbar: null
        },
        SUCHEN: 'Spielerliste erstellen'
      }
    };
    const html: string = await rp(`${this.baseURL}/paesse/mod_po/webflow0.do`, options);

    // eslint-disable-next-line new-cap
    const soup: JSSoup = new JSSoup.default(html);

    const forms = soup.find('form', { name: 'actionForm' });
    const hash = soup.find('input', { name: 'de.sbs.pweb.jlist.pagehash_1' });

    return { uri: this.baseURL + forms.attrs.action, hash: +hash.attrs.value };
  }

  protected async spielerExport(uri: string, hash: number) {
    const options = {
      method: 'POST',
      encoding: 'binary',
      resolveWithFullResponse: true,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36'
      },
      jar: this.jar,
      form: {
        event: 'DOWNLOAD',
        _kontext: {
          vereinSearchParameter: `Sportfreunde Winterbach / ${this.user.split('-')[0]}`
        },
        kontext: {
          selectedId: undefined,

          spielerArt: 0,
          suche: {
            altersklasseId: undefined,
            geschlecht: undefined,
            art: 1
          },
          einsetzbar: undefined,
          result: {
            selectedIds: undefined
          },
          submitAction: undefined
        },
        de: {
          sbs: {
            pweb: {
              jlist: {
                page_1: 1,
                numitems_1: 10,
                sort_1: 'nachname:up:none',
                pagehash_1: hash
              }
            }
          }
        }
      }
    };
    return await rp(uri, options);
  }

  public async scrape(): Promise<PlayerGR[]> {
    const loginResp = await this.login();
    const passOnlineResp = await this.passOnline(loginResp);
    await this.spielerListe(passOnlineResp);
    const { uri, hash } = await this.spielerListeErstellen();
    const spielerExportResp: any = await this.spielerExport(uri, hash);
    const csvLatin: any = spielerExportResp.body;
    const csvStart = csvLatin.indexOf('Passnr');
    const csv = csvLatin.slice(csvStart);
    const jsonObj: PlayerGR[] = csvjson.toObject(csv, { delimiter: ';' });
    return jsonObj;
  }
}
