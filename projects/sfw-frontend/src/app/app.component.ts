import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
declare let AOS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title!: string;

  public isBrowser = isPlatformBrowser(this.platformId);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private swUpdate: SwUpdate,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }


  ngOnInit() {

    AOS.init();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.title = this.activatedRoute.firstChild?.snapshot.data.title;
      }
    });

    if (this.swUpdate.isEnabled) {
      console.log('Neue Version verfügbar!');
      /* this.swUpdate.available.subscribe(() => {
        const snack = this.snackbar.open('Es ist eine neue Version der App verfügbar', 'Neu laden?', {
          verticalPosition: 'top',
        });

        snack.onAction().subscribe(() =>  window.location.reload());
      }); */
    }
  }
}
