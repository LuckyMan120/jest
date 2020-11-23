import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Observable } from 'rxjs';
import { LocationService } from '../location.service';
import { Location } from '../_interfaces/location.interface';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.scss']
})
export class LocationMapComponent implements OnInit {

  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  center = {
    lat: 49.480313,
    lng: 7.096092
  };
  markerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 8;
  display?: google.maps.LatLngLiteral;

  locations$!: Observable<Location[]>;
  config: PerfectScrollbarConfigInterface = {};

  constructor(
    private locationService: LocationService
  ) {
  }

  ngOnInit() {
    this.locations$ = this.locationService.getLocationsWithMarkers();
  }

  addMarker(event: google.maps.MouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
  }

  move(event: google.maps.MouseEvent) {
    this.display = event.latLng.toJSON();
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  removeLastMarker() {
    this.markerPositions.pop();
  }

}
