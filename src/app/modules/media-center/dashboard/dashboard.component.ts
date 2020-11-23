import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaService } from './../../../shared/modules/media/media.service';
import { LayoutUtilsService } from './../../../shared/services/layout-utils.service';

@Component({

  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private mediaService: MediaService
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  showStatistics() {
    console.log('ToDo');
    // this.layoutUtilsService.showMediaStatistics(this.mediaService.getMediaStats());
  }

}
