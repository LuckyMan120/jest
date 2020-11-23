import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationDashboardComponent } from './location-dashboard/location-dashboard.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { LocationFormComponent } from './location-form/location-form.component';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationMapComponent } from './location-map/location-map.component';
import { LocationsComponent } from './locations/locations.component';

export const locationRoutes: Routes = [
  {
    path: '',
    component: LocationsComponent,
    children: [
      {
        path: 'dashboard',
        component: LocationDashboardComponent
      },
      {
        path: 'list',
        component: LocationListComponent
      },
      {
        path: 'edit/:locationId',
        component: LocationFormComponent
      },
      {
        path: 'create',
        component: LocationFormComponent
      },
      {
        path: 'detail/:locationId',
        component: LocationDetailComponent
      },
      {
        path: 'map',
        component: LocationMapComponent
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(locationRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LocationRoutingModule {
}

