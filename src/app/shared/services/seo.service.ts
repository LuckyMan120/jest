import { DOCUMENT, formatDate, FormatWidth, getLocaleDateFormat } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from './../../../environments/environment';

@Injectable()
export class SeoService { // implements OnDestroy

  // unsubscribe: Subscription[] = [];
  dateFormat!: string;

  constructor(
    @Inject(DOCUMENT) private dom: any,
    private meta: Meta,
    private title: Title,
    // private appService: ApplicationService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  init() {
    this.dateFormat = getLocaleDateFormat(this.locale, FormatWidth.Medium);

    const now = formatDate(new Date(), this.dateFormat, this.locale);
    const defaults = environment.appDefaults;

    this.title.setTitle(defaults.site.title);
    this.meta.updateTag({ name: 'description', content: defaults.site.description }, 'name="description"');
    this.meta.updateTag({ name: 'robots', content: 'index, follow' }, 'name="robotsn"');
    this.meta.updateTag({ name: 'keywords', content: defaults.site.keywords }, 'name="keywords"');
    this.meta.updateTag({ name: 'author', content: defaults.site.author }, 'name="author"');
    this.meta.updateTag({ name: 'date', content: now, scheme: this.dateFormat }, 'name="date"');
    this.meta.updateTag({ charset: 'UTF-8' });

    /* const appSubscription = this.appService.getCurrentApplication().pipe(
      map((app: Application | undefined) => {
        this.title.setTitle(app?.site.subTitle as string || defaults.site.title);
        // eslint-disable-next-line
        this.meta.updateTag({ name: 'description', content: app?.site.description || defaults.site.description }, 'name="description"');
        this.meta.updateTag({ name: 'robots', content: 'index, follow' }, 'name="robotsn"');
        this.meta.updateTag({ name: 'keywords', content: app?.site.keywords as string || defaults.site.keywords }, 'name="keywords"');
        this.meta.updateTag({ name: 'author', content: app?.site.author as string } || defaults.site.author, 'name="author"');
        this.meta.updateTag({ name: 'date', content: now, scheme: this.dateFormat }, 'name="date"');
        this.meta.updateTag({ charset: 'UTF-8' });
      })
    ).subscribe();
    this.unsubscribe.push(appSubscription); */
  }

  /* ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  } */

  setCanonicalURL(url?: string) {
    const canURL = url === undefined ? this.dom.URL : url;
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', canURL);
  }

}
