import { Component, Input } from "@angular/core";

import { TrackService } from "../../providers/track.state";
import * as L from 'leaflet';

@Component({
    selector: 'map',
    template: `<div
        leaflet
        class="pure-u-1"
        [leafletOptions]="options"
        [leafletLayersControl]="layersControl"
        [leafletLayers]="layers"
        [leafletFitBounds]="fitBounds"></div>`,
    styles: ['div { height: 70vh; }'],
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
        center: L.latLng([ 46.879966, -121.726909 ])
    };

    layersControl = {
        baseLayers: {
            'Hike & Bike': L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', { maxZoom: 18 }),
            'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }),
        }
    };

    layers: L.Layer[] = [];

    @Input()
    set track(data: GeoJSON.FeatureCollection<GeoJSON.LineString>) {
        this.layers = [L.geoJSON(data)];
    }

    fitBounds = this.layers.length > 0 ? this.layers : [[40.750, -78], [40.774, -74.125]];
}