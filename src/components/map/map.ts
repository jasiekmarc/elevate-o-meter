import { Component } from '@angular/core';

import { TrackService } from '../../providers/track.state';
import { LayerService } from '../../providers/layer.service';
import * as L from 'leaflet';
import 'leaflet-providers';

@Component({
  selector: 'app-map',
  template: `<div
        leaflet
        [leafletOptions]="options"
        [leafletLayers]="layerService.layers"
        [leafletLayersControl]="layersControl"
        [leafletFitBounds]="layerService.fitBounds"></div>`,
  styles: ['div { height: 100%; width: 100%; }'],
})
export class MapComponent {
  topoMap = L.tileLayer.provider('OpenTopoMap');
  hikeBikeMap = L.tileLayer.provider('HikeBike.HikeBike');
  openStreetMap = L.tileLayer.provider('OpenStreetMap.Mapnik');

  options = {
    layers: [
      this.hikeBikeMap
    ],
    zoom: 5,
    center: L.latLng([51, 17])
  };

  layersControl = {
    baseLayers: {
      'Hike & Bike': this.hikeBikeMap,
      'OpenTopoMap': this.topoMap,
      'Open Street Map': this.openStreetMap,
    }
  };

  constructor(public layerService: LayerService) { }
}
