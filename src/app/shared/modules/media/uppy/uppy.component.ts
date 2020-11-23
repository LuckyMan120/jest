import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Config } from '@shared/_interfaces/config.interface';
import * as Uppy from '@uppy/core';
import * as Dashboard from '@uppy/dashboard';
import * as Facebook from '@uppy/facebook';
import * as ImageEditor from '@uppy/image-editor';
import * as Unsplash from '@uppy/unsplash';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Dropbox, GoogleDrive, Instagram, StatusBar, Url } from 'uppy';
import { UploadService } from '../../../services/upload.service';
import { environment } from './../../../../../environments/environment';
import FirebaseCloudStorage from './firebaseCloudStorage';

@Component({
  selector: 'uppy',
  templateUrl: './uppy.component.html',
  styleUrls: ['./uppy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UppyComponent implements AfterViewInit, OnDestroy, OnInit {

  public id: number = this.uploadService.uid;

  @Input() galleryName!: string;
  @Input() tags!: string[];
  @Input() height: string | number = 300;
  @Input() width: string | number = '100%';
  @Input() thumbnailWidth: string | number = 280;
  @Input() autoProceed = false;

  @Output() fileAdded = new EventEmitter<void>();

  private destroyed$ = new Subject<void>();
  private uppy!: Uppy.Uppy<Uppy.StrictTypes>;

  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private uploadService: UploadService
  ) {
  }

  ngOnInit() {
    this.afs.doc<Config>(`config/1`).valueChanges().pipe(
      takeUntil(this.destroyed$),
      switchMap((config: Config | undefined) => {
        const uppyCfg = config?.uppy;

        if (uppyCfg) {

          const companionUrl = uppyCfg.companionUrl;

          if (uppyCfg.instagram) {
            this.uppy.use(Instagram, { target: Dashboard, companionUrl });
          }

          if (uppyCfg.facebook) {
            this.uppy.use(Facebook, { target: Dashboard, companionUrl });
          }

          if (uppyCfg.unsplash) {
            this.uppy.use(Unsplash, { target: Dashboard, companionUrl });
          }

          if (uppyCfg.dropbox) {
            this.uppy.use(Dropbox, { target: Dashboard, companionUrl });
          }

          if (uppyCfg.url) {
            this.uppy.use(Url, { target: Dashboard, companionUrl });
          }

          if (uppyCfg.googleDrive) {
            this.uppy.use(GoogleDrive, { target: Dashboard, companionUrl });
          }
        }

        return this.uploadService.uploadObservable; // .pipe(tap(console.log), takeUntil(this.destroyed$))
      })
    ).subscribe(() => {
      this.uppy.upload().then((result) => {
        this.uploadService.uploadFinish();
        console.log('Successful uploads:', result.successful);
        if (result.failed.length > 0) {
          console.error('Errors:');
          result.failed.forEach((file) => {
            console.error(file.error);
          });
        }
      });
    });
  }

  ngAfterViewInit() {

    this.uppy = Uppy({
      debug: !environment.production,
      autoProceed: this.autoProceed,
      // locale: *asGerman,
    })
      .use(Dashboard, {
        // theme: 'dark',
        target: `.uploadContainer-${this.id}`,
        proudlyDisplayPoweredByUppy: false,
        inline: true,
        height: this.height,
        width: this.width,
        thumbnailWidth: this.thumbnailWidth,
        hideUploadButton: true,
        metaFields: [
          { id: 'title', name: 'Titel', placeholder: 'Titel der Datei' },
          { id: 'author', name: 'Fotograf', placeholder: 'Wer hat das Foto gemacht?' },
          { id: 'description', name: 'Bildbeschriftung', placeholder: 'Bildbeschriftung zur Anzeige unter dem Bild' }
        ]
      })
      .use(ImageEditor, { target: Dashboard })
      .use(StatusBar, {
        target: `.uploadContainer-${this.id}`,
        showProgressDetails: true,
        // locale: German
      })
      .use(FirebaseCloudStorage, {
        storage: this.storage,
        auth: this.afa,
        afs: this.afs,
        service: this.uploadService,
        galleryName: this.galleryName,
        tags: this.tags
      })
      // .use(DragDrop, { target: `.uploadContainer-${this.id}` })
      .on('file-added', () => this.fileAdded.emit())
      .on('complete', (result: any) => {
        console.log('successful files:', result.successful);
        console.log('failed files:', result.failed);
      })
      .on('error', (file, error, response) => {
        console.log('error with file:', file.id);
        console.log('error message:', error);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
