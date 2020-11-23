import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { TimelineFormComponent } from './timeline-form/timeline-form.component';
import { TimelineRoutingModule } from './timeline-routing.module';
import { TimelineTableComponent } from './timeline-table/timeline-table.component';
import { TimelineViewComponent } from './timeline-view/timeline-view.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TimeLineService } from './timline.service';

@NgModule({
  declarations: [
    TimelineComponent,
    TimelineFormComponent,
    TimelineTableComponent,
    TimelineViewComponent
  ],
  exports: [
    TimelineComponent,
    TimelineFormComponent
  ],
  imports: [
    AutocompleteModule,
    CommonModule,
    MatSelectModule,
    RouterModule,
    SharedModule,

    TimelineRoutingModule
  ],
  providers: [
    TimeLineService
  ]
})
export class TimelineModule {
}
