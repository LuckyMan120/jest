import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { concat, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FroalaService {

  private _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

  constructor(@Inject(DOCUMENT) private readonly document: any) { }

  // Import a single Froala Editor plugin.
  // import 'froala-editor/js/plugins/align.min.js';

  // Import a third-party plugin.
  // import 'froala-editor/js/third_party/font_awesome.min';
  // import 'froala-editor/js/third_party/image_tui.min';
  // import 'froala-editor/js/third_party/spell_checker.min';
  // import 'froala-editor/js/third_party/embedly.min';

  lazyLoadFroala(): Observable<any> {
    return concat([
      this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/froala-editor/3.2.3/js/froala_editor.min.js'),
      this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/froala-editor/3.2.3/js/plugins.pkgd.min.js'),
      this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.js'),
      this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/mode/xml/xml.min.js'),
      this.loadScript('https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js'),
      this.loadScript('https://cdn.embedly.com/widgets/platform.js'),
      this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/froala-editor/3.2.3/js/languages/de.js'),
      this.loadStyle('https://cdnjs.cloudflare.com/ajax/libs/froala-editor/3.2.3/css/froala_editor.pkgd.min.css'),
      this.loadStyle('https://cdnjs.cloudflare.com/ajax/libs/froala-editor/3.2.3/css/froala_style.min.css'),
      this.loadStyle('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.css')
    ]);
  }

  private loadScript(url: string): Observable<any> {
    if (this._loadedLibraries[url]) {
      return this._loadedLibraries[url].asObservable();
    }

    this._loadedLibraries[url] = new ReplaySubject();

    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    script.onload = () => {
      this._loadedLibraries[url].next();
      this._loadedLibraries[url].complete();
    };

    this.document.body.appendChild(script);
    return this._loadedLibraries[url].asObservable();
  }

  private loadStyle(url: string): Observable<any> {
    if (this._loadedLibraries[url]) {
      return this._loadedLibraries[url].asObservable();
    }

    this._loadedLibraries[url] = new ReplaySubject();

    const style = this.document.createElement('link');
    style.type = 'text/css';
    style.href = url;
    style.rel = 'stylesheet';
    style.onload = () => {
      this._loadedLibraries[url].next();
      this._loadedLibraries[url].complete();
    };

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(style);

    return this._loadedLibraries[url].asObservable();
  }
}
