import { Component, Input } from "@angular/core";

import { TrackService } from "../../providers/track.state";
import { LayerService } from "../../providers/layer.service";
import * as L from 'leaflet';

@Component({
    selector: 'map',
    template: `<div
        leaflet
        [leafletOptions]="options"
        [leafletLayersControl]="layersControl"
        [leafletLayers]="layerService.layers"
        [leafletFitBounds]="layerService.fitBounds"></div>`,
    styles: ['div { height: 66vh; }'],
})
export class MapComponent {
    options = {
        layers: [
            L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '<a href="http://osm.org/copyright">OpenStreetMap</a>'
            })
        ],
        zoom: 5,
        center: L.latLng([ 51, 17 ])
    };

    layersControl = {
        baseLayers: {
            'Hike & Bike': L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', { maxZoom: 18 }),
            'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }),
        }
    };

    constructor(public layerService: LayerService) {}
}