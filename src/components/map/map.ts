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
            L.tileLayer('https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token={token}', {
                maxZoom: 18,
                attribution: '<a href="http://mapbox.com">Mapbox</a>',
                token: 'pk.eyJ1IjoiamFzaWVrbWFyYyIsImEiOiJ6c3JfeENVIn0.tl9wzuRmikzx4aL8q-x_3w',
            })
        ],
        zoom: 5,
        center: L.latLng([51, 17])
    };

    layersControl = {
        baseLayers: {
            'Mapbox Outdoors': L.tileLayer('https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token={token}', {
                maxZoom: 18,
                attribution: '<a href="http://mapbox.com">Mapbox</a>',
                token: 'pk.eyJ1IjoiamFzaWVrbWFyYyIsImEiOiJ6c3JfeENVIn0.tl9wzuRmikzx4aL8q-x_3w'
            }),
            'Hike & Bike': L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '<a href="https//osm.org>Open Street Map</a>"'
            }),
            'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '<a href="https//osm.org>Open Street Map</a>"'
            }),
        }
    };

    constructor(public layerService: LayerService) { }
}