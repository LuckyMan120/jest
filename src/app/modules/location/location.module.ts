import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { WidgetModule } from '../../shared/modules/widgets/widget.module';
import { SharedModule } from '../../shared/shared.module';
import { WysiwygModule } from './../../shared/modules/wysiwyg/wysiwyg.module';
import { LocationDashboardComponent } from './location-dashboard/location-dashboard.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { LocationFormComponent } from './location-form/location-form.component';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationMapComponent } from './location-map/location-map.component';
import { LocationRoutingModule } from './location-routing.module';
import { LocationService } from './location.service';
import { LocationsComponent } from './locations/locations.component';


@NgModule({
  declarations: [
    LocationsComponent,
    LocationFormComponent,
    LocationDetailComponent,
    LocationMapComponent,
    LocationListComponent,
    LocationDashboardComponent
  ],
  imports: [
    GoogleMapsModule,
    LocationRoutingModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatMenuModule,
    MatOptionModule,
    PerfectScrollbarModule,
    SharedModule,

    WidgetModule,
    WysiwygModule
  ],
  providers: [
    LocationService
  ]
})
export class LocationModule {
}
