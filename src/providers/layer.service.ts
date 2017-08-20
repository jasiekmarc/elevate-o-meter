import { Injectable } from "@angular/core";
import * as L from "leaflet";
import "drmonty-leaflet-awesome-markers";


@Injectable()
export class LayerService {

    /* Range markers (flags) for peak-adding */
    rangeBe: number;
    rangeEn: number;

    trackGeoJSON: GeoJSON.LineString;

    peakMarkers: number[];

    fitBounds: L.LatLngBounds = null;

    moveRangeFlags(be: number, en: number) {
        this.rangeBe = be;
        this.rangeEn = en;
    }

    addPeakFlag(ind: number, ele: number) {
        this.peakMarkers.push(ind);
    }

    active(): boolean {
        return !(this.trackGeoJSON == null);
    }

    loadTrack(track: GeoJSON.Feature<GeoJSON.LineString>) {
        this.peakMarkers = [];
        this.trackGeoJSON = track.geometry;
        this.moveRangeFlags(0, this.trackGeoJSON.coordinates.length);
    }

    private coordinatesAtIndex(ind: number): [number, number] {
        return [
            this.trackGeoJSON.coordinates[ind][1],
            this.trackGeoJSON.coordinates[ind][0],
        ];
    }

    private markerInLatLng(index: number, name: string, color: string): L.Marker {
        return L.marker(this.coordinatesAtIndex(index), {
            icon:  L.AwesomeMarkers.icon({
                prefix: 'mdi',
                icon: name,
                markerColor: color,
            })
        });
    }

    layers(): L.Layer[] {
        if (this.trackGeoJSON == null)
            return [];
        const layers = [
            this.markerInLatLng(this.rangeBe, 'play', 'green'),
            this.markerInLatLng(this.rangeEn-1, 'stop', 'red'),
            L.geoJSON(this.trackGeoJSON),
        ].concat(this.peakMarkers.map(ind =>
            this.markerInLatLng(ind, 'terrain', 'yellow')));
        return layers;
    }
}